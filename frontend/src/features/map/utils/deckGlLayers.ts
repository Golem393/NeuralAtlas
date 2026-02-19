import type { Map as MapLibreMap } from 'maplibre-gl';
import { DECK_LAYER_CONFIGS } from '../config/deckLayerConfig';
import { GeometrySampler } from '../lib/mapGeometry';
import type { DeckLayerConfig, SamplerConfig } from '../types';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { GLTFLoader } from '@loaders.gl/gltf';

export const getActiveLayerSources = (activeDeckGLLayers: string[]): string[] => {
  const sources = activeDeckGLLayers.flatMap(layerId => {
    const config = DECK_LAYER_CONFIGS[layerId];
    if (!config?.sources) return [];
    return config.sources.map(source => source.sourceId);
  });
  return [...new Set(sources)];
};

export const getFeaturesBySourceLayer = (
  map: MapLibreMap,
  activeDeckGLLayers: string[],
): Map<string, GeoJSON.Feature[]> => {
  const featuresBySourceLayer = new Map<string, GeoJSON.Feature[]>();
  const queriedSourceLayers = new Set<string>();
  for (const layerId of activeDeckGLLayers) {
    const config = DECK_LAYER_CONFIGS[layerId];
    if (!config?.sources) continue;
    for (const source of config.sources) {
      if (queriedSourceLayers.has(source.sourceLayer)) continue;
      const features = map.querySourceFeatures(source.sourceId, { sourceLayer: source.sourceLayer });
      featuresBySourceLayer.set(source.sourceLayer, features);
      queriedSourceLayers.add(source.sourceLayer);
    }
  }
  return featuresBySourceLayer;
};

export const convertFeaturesToGeometries = (
  features: GeoJSON.Feature[],
  deckLayerConfig: DeckLayerConfig
) => {
  const allGeometries = features.flatMap((feature, idx) => {
    const geom = feature.geometry as GeoJSON.Geometry;
    const rings: number[][][] = [];
    
    if (geom.type === 'Polygon') {
      rings.push(geom.coordinates[0]); 
    } else if (geom.type === 'MultiPolygon') {
      geom.coordinates.forEach(polygon => {
        rings.push(polygon[0]);
      });
    }

    const samplerSettings = deckLayerConfig.samplerSettings as SamplerConfig;

    //const featureId = feature.id || feature.properties?.id || idx; TODO
    const seed = `${deckLayerConfig.id}`;
    const sampler = new GeometrySampler({ 
      ...samplerSettings,
      seed 
    });

    return rings.flatMap(ring => sampler.sampleInPolygon(ring));
  });

  return allGeometries;
};


export const createScenegraphLayer = (
    deckLayerConfig: DeckLayerConfig,
    allGeometries: any[],
    terrainEnabled: boolean,
    terrainExaggeration: number,
    queryTerrainElevation: any
  ) => {
      const layer = new ScenegraphLayer({
        id: deckLayerConfig.id,
        data: allGeometries,
        scenegraph: deckLayerConfig.modelUrl,
        loaders: [GLTFLoader],
        getPosition: (d: any) => {
          /*const baseElevation = terrainEnabled && queryTerrainElevation
            ? queryTerrainElevation([d.position[0], d.position[1]])
            : 0;*/
          //const baseElevation = 0
          
          //const elevation = (baseElevation || 0) * terrainExaggeration;
          const elevation = 0;
          return [d.position[0], d.position[1], elevation + d.position[2] + d.elevationOffset];
        },
        getOrientation: (d: any) => [0, d.rotation, 90],
        getScale: (d: any) => [d.scale, d.scale, d.scale],
        sizeScale: 1,
        _lighting: 'pbr',
        pickable: true,
      });
      
      return layer;
  };

