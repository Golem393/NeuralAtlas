import { useCallback, useEffect, useMemo, useRef } from 'react';
import { MapboxOverlay } from '@deck.gl/mapbox';
import type { Map as MapLibreMap, MapSourceDataEvent } from 'maplibre-gl';
import debounce from 'lodash.debounce';
import { useMapStore} from '../store';
import { DECK_LAYER_CONFIGS } from '../config/deckLayerConfig';
import { getFeaturesBySourceLayer, convertFeaturesToGeometries, 
         getActiveLayerSources, createScenegraphLayer } from '../utils/deckGlLayers';


export const useDeckGLLayers = (
  map: React.RefObject<MapLibreMap | null>,
  mapLoaded: boolean,
) => {
  const terrainExaggeration = useMapStore((state) => state.terrainExaggeration);
  const terrainEnabled = useMapStore((state) => state.visibleLayers.terrain);
  const activeDeckGLLayers = useMapStore((state) => state.activeDeckGLLayers);
  const activeLayerSources = useMemo(() => getActiveLayerSources(activeDeckGLLayers), [activeDeckGLLayers]);

  const overlay = useMemo(() => {
    return new MapboxOverlay({
      //interleaved: true, // Usually desired with Mapbox/MapLibre to verify depth testing
      layers: []
    });
  }, []);
  //const renderedLayersRef = useRef<Map<string, ScenegraphLayer>>(new Map());



  const updateGLLayers = useCallback(() => {
      if (!map.current) return;

      const allSourcesLoaded = activeLayerSources.every(sourceId => {
        const source = map.current?.getSource(sourceId);
        return source ? (source as any).loaded() : false;
      });

      if (!allSourcesLoaded) {
        overlay.setProps({ layers: [] });
        return;
      }

      const featuresBySourceLayer = getFeaturesBySourceLayer(map.current, activeDeckGLLayers);
      

      let allLayers = [];

      const zoom = map.current.getZoom();
      for (const layerId of activeDeckGLLayers) {
        const config = DECK_LAYER_CONFIGS[layerId];
        if (config.minZoom !== undefined && zoom < config.minZoom) {
          continue;
        }
        if (config.maxZoom !== undefined && zoom > config.maxZoom) {
          continue;
        }

        for (const sourceConfig of config.sources) {
          const source_features = featuresBySourceLayer.get(sourceConfig.sourceLayer)
          if (!source_features || source_features.length === 0) continue;
          const filteredFeatures = source_features.filter(sourceConfig.filter);
          if (filteredFeatures.length === 0) continue;
          const allGeometries =  convertFeaturesToGeometries(filteredFeatures, config);
          if (allGeometries.length === 0) continue;

          const deckLayer = createScenegraphLayer(
            config,
            allGeometries,
            terrainEnabled,
            terrainExaggeration,
            map.current.queryTerrainElevation)
          allLayers.push(deckLayer);
        }
      }
      overlay.setProps({ layers: allLayers });
    }, [map, terrainEnabled, terrainExaggeration, activeDeckGLLayers, overlay]);


  const updateGLLayersRef = useRef(updateGLLayers);
    useEffect(() => {
      updateGLLayersRef.current = updateGLLayers;
    }, [updateGLLayers]);

   useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (!map.current.hasControl(overlay as any)) {
      map.current.addControl(overlay as any);
    }

    const handleUpdate = () => {
      updateGLLayersRef.current();
    };

    const debouncedUpdate = debounce(handleUpdate, 200, { 
      maxWait: 500  // wait 200ms after the last call, but at most 500ms
    });
    const onSourceData = (e: MapSourceDataEvent) => {
      if (activeLayerSources.includes(e.sourceId) && e.isSourceLoaded) {
        debouncedUpdate();
      }
    };
    map.current.on('sourcedata', onSourceData);
    map.current.on('moveend', debouncedUpdate);

    updateGLLayers();

    return () => {
      if (map.current) {
        map.current.off('sourcedata', onSourceData);
        map.current.off('moveend', debouncedUpdate);
        if (map.current?.hasControl(overlay as any)) {
          map.current.removeControl(overlay as any);
        }
      }
      debouncedUpdate.cancel();
    };
  }, [map, mapLoaded, overlay]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    updateGLLayers();
  }, [updateGLLayers]);


};