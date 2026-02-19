import { useCallback, useEffect, useMemo, useRef } from 'react';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import type { Map as MapLibreMap, MapSourceDataEvent } from 'maplibre-gl';
import { GLTFLoader } from '@loaders.gl/gltf';
import debounce from 'lodash.debounce';
import { GeometrySampler} from '../lib/mapGeometry';
import { useMapStore} from '../store';
import { DECK_LAYER_CONFIGS } from '../config/deckLayerConfig';

export const useDeckGLLayers = (
 map: React.RefObject<MapLibreMap | null>,
 mapLoaded: boolean,
) => {
 const terrainExaggeration = useMapStore((state) => state.terrainExaggeration);
 const terrainEnabled = useMapStore((state) => state.visibleLayers.terrain);
 const activeDeckGLLayers = useMapStore((state) => state.activeDeckGLLayers);
 const activeLayerSources = useMemo(() => {
  const sources = activeDeckGLLayers.flatMap(layerId => {
   const config = DECK_LAYER_CONFIGS[layerId];
   if (!config?.sources) return [];
   return config.sources.map(source => source.sourceId);
  });
  return [...new Set(sources)];
 }, [activeDeckGLLayers]);

 const overlay = useMemo(() => {
  return new MapboxOverlay({
   //interleaved: true, // Usually desired with Mapbox/MapLibre to verify depth testing
   layers: []
  });
 }, []);
 const renderedLayersRef = useRef<Map<string, ScenegraphLayer>>(new Map());



 const updateGLLayers = useCallback(() => {
   if (!map.current) return;

   const zoom = map.current.getZoom();
   if (zoom < 13) {
    overlay.setProps({ layers: [] });
    return;
   }

   const isSourceLoaded = map.current.isSourceLoaded('land_physical');
   const landPhysicalFeatures = map.current.querySourceFeatures('land_physical', {
    sourceLayer: 'land_physical'
   });

   if (!landPhysicalFeatures.length) {
    if (isSourceLoaded) {
     overlay.setProps({ layers: [] });
    }
   }
 
   const forestFeatures = landPhysicalFeatures.filter(feature => {
    const props = feature.properties;
    return props?.class === 'forest' ||
       props?.subclass === 'forest' ||
       props?.subclass === 'wood' ||
       props?.class === 'wood';
   });

   if (!forestFeatures.length) {
    overlay.setProps({ layers: [] });
    return;
   }

   const allTrees = forestFeatures.flatMap((feature, idx) => {
     const geom = feature.geometry as GeoJSON.Geometry;
     const rings: number[][][] = [];
     if (geom.type === 'Polygon') {
       rings.push(geom.coordinates[0]);
     } else if (geom.type === 'MultiPolygon') {
       geom.coordinates.forEach(polygon => {
         rings.push(polygon[0]);
       });
     }

     // Use feature ID or first coordinate as deterministic seed
     const featureId = feature.id || feature.properties?.id || idx;
     const seed = `forest-${featureId}`;
     const sampler = new GeometrySampler({
      ...DECK_LAYER_CONFIGS['trees'].samplerSettings,
      seed
     });

     const trees = rings.flatMap(ring => sampler.sampleInPolygon(ring));
     return trees;
   });

   if (allTrees.length === 0) {
    overlay.setProps({ layers: [] });
    return;
   }

   const trees3DLayer = new ScenegraphLayer({
    id: 'trees-3d',
    data: allTrees,
    scenegraph: '/models/tree_small.glb',
    loaders: [GLTFLoader],
    getPosition: (d: any) => {
     const baseElevation = terrainEnabled && map.current?.queryTerrainElevation
      ? map.current.queryTerrainElevation([d.position[0], d.position[1]])
      : 0;
    
     const elevation = (baseElevation || 0) * terrainExaggeration;
    
     return [d.position[0], d.position[1], elevation + d.position[2] + d.elevationOffset];
    },
    getOrientation: (d: any) => [0, d.rotation, 90],
    getScale: (d: any) => [d.scale, d.scale, d.scale],
    sizeScale: 1,
    _lighting: 'pbr',
    pickable: true,
   });
   overlay.setProps({ layers: [trees3DLayer] });
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

  const debouncedUpdate = debounce(updateGLLayers, 200, {
   maxWait: 500 // wait 200ms after the last call, but at most 500ms
  });
  const onSourceData = (e: MapSourceDataEvent) => {
   if (activeLayerSources.includes(e.sourceId) && e.isSourceLoaded) {
    debouncedUpdate(); //TODO
   }
  };
  map.current.on('sourcedata', onSourceData);
  map.current.on('moveend', debouncedUpdate);

  updateGLLayers();

  return () => {
   if (map.current) {
    map.current.off('sourcedata', onSourceData);
    map.current.off('moveend', debouncedUpdate);
   }
   debouncedUpdate.cancel();
   if (map.current?.hasControl(overlay as any)) {
    map.current.removeControl(overlay as any);
   }
  };
 }, [map, mapLoaded, overlay]);
 };