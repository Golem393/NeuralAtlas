import { useCallback, useEffect, useMemo, useRef } from 'react';
import { MapboxOverlay } from '@deck.gl/mapbox';
import type { Map as MapLibreMap, MapSourceDataEvent } from 'maplibre-gl';
import debounce from 'lodash.debounce';
import { useMapStore } from '../store';
import { DECK_LAYER_CONFIGS } from '../config/deckLayerConfig';
import { 
  getFeaturesBySourceLayer, 
  convertFeaturesToGeometries, 
  getActiveLayerSources, 
  createScenegraphLayer 
} from '../utils/deckGlLayers';

export const useDeckGLLayers = (
  map: React.RefObject<MapLibreMap | null>,
  mapLoaded: boolean,
) => {
  const terrainExaggeration = useMapStore((state) => state.terrainExaggeration);
  const terrainEnabled = useMapStore((state) => state.visibleLayers.terrain);
  const activeDeckGLLayers = useMapStore((state) => state.activeDeckGLLayers);

  // 1. Create the overlay once
  const overlay = useMemo(() => {
    return new MapboxOverlay({
      layers: []
    });
  }, []);

  // 2. CACHE: Store processed geometries here so they persist between renders
  // Structure: { [layerId]: GeometryData[] }
  const geometryCache = useRef<Record<string, any[]>>({});

  // 3. RENDER: The "Cheap" function. 
  // Only takes existing data and applies visual settings (terrain, etc.)
  const renderLayers = useCallback(() => {
    if (!map.current) return;

    const allLayers = [];
    const zoom = map.current.getZoom();

    for (const layerId of activeDeckGLLayers) {
      const config = DECK_LAYER_CONFIGS[layerId];
      
      // Skip if zoom out of bounds
      if (config.minZoom !== undefined && zoom < config.minZoom) continue;
      if (config.maxZoom !== undefined && zoom > config.maxZoom) continue;

      // Retrieve cached data for this layer
      // If data is missing (not fetched yet), we skip rendering this frame
      const cachedData = geometryCache.current[layerId];
      if (!cachedData || cachedData.length === 0) continue;

      // Create the layer using cached data + CURRENT terrain settings
      const deckLayer = createScenegraphLayer(
        config,
        cachedData, // <--- Using cached geometry
        terrainEnabled,
        terrainExaggeration,
        map.current.queryTerrainElevation
      );

      allLayers.push(deckLayer);
    }

    overlay.setProps({ layers: allLayers });
  }, [map, activeDeckGLLayers, terrainEnabled, terrainExaggeration, overlay]);


  // 4. DATA FETCH: The "Expensive" function.
  // Queries map features and converts them. Only runs when map moves or source loads.
  const refreshData = useCallback(() => {
    if (!map.current) return;

    const activeLayerSources = getActiveLayerSources(activeDeckGLLayers);
    const allSourcesLoaded = activeLayerSources.every(sourceId => {
      const source = map.current?.getSource(sourceId);
      return source ? (source as any).loaded() : false;
    });

    if (!allSourcesLoaded) return;

    // Heavy lifting: Query map features
    const featuresBySourceLayer = getFeaturesBySourceLayer(map.current, activeDeckGLLayers);
    
    // Process and cache data for each active layer
    activeDeckGLLayers.forEach(layerId => {
      const config = DECK_LAYER_CONFIGS[layerId];
      let layerGeometries: any[] = [];

      for (const sourceConfig of config.sources) {
        const source_features = featuresBySourceLayer.get(sourceConfig.sourceLayer);
        if (!source_features || source_features.length === 0) continue;
        
        const filteredFeatures = source_features.filter(sourceConfig.filter);
        if (filteredFeatures.length === 0) continue;

        // Heavy lifting: Convert to DeckGL format
        const geometries = convertFeaturesToGeometries(filteredFeatures, config);
        layerGeometries = layerGeometries.concat(geometries);
      }

      // Update Cache
      geometryCache.current[layerId] = layerGeometries;
    });

    // Once data is updated, trigger a render
    renderLayers();

  }, [map, activeDeckGLLayers, renderLayers]); 


  // 5. EFFECT: Handle Map Events (Move/SourceData) -> Triggers refreshData
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (!map.current.hasControl(overlay as any)) {
      map.current.addControl(overlay as any);
    }

    // Debounce the expensive data fetch
    const debouncedRefreshData = debounce(refreshData, 200, { maxWait: 500 });
    
    const onSourceData = (e: MapSourceDataEvent) => {
       // Only update if relevant sources change
       const activeSources = getActiveLayerSources(activeDeckGLLayers);
       if (activeSources.includes(e.sourceId) && e.isSourceLoaded) {
         debouncedRefreshData();
       }
    };

    // Events that require recalculating geometry (moving the map changes which features are visible)
    map.current.on('sourcedata', onSourceData);
    map.current.on('moveend', debouncedRefreshData);
    
    // Initial load
    refreshData();

    return () => {
      if (map.current) {
        map.current.off('sourcedata', onSourceData);
        map.current.off('moveend', debouncedRefreshData);
        if (map.current.hasControl(overlay as any)) {
          map.current.removeControl(overlay as any);
        }
      }
      debouncedRefreshData.cancel();
    };
  }, [map, mapLoaded, overlay, refreshData, activeDeckGLLayers]);


  // 6. EFFECT: Handle Visual Changes (Terrain) -> Triggers renderLayers directly
  // This is the key fix: We depend ONLY on renderLayers here, NOT refreshData
  useEffect(() => {
    renderLayers();
  }, [renderLayers]); // renderLayers depends on terrainEnabled/Exaggeration
};