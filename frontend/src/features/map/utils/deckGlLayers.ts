import type { Map as MapLibreMap } from 'maplibre-gl';
import type { Feature, Geometry } from 'geojson';
import { DECK_LAYER_CONFIGS } from '../config/deckLayerConfig';
import { GeometrySampler } from '../lib/mapGeometry';
import type { SampledObject } from '../lib/mapGeometry/types';
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
): Map<string, Feature[]> => {
  const featuresBySourceLayer = new Map<string, Feature[]>();
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
  features: Feature[],
  deckLayerConfig: DeckLayerConfig
) => {
  const allGeometries = features.flatMap((feature) => {
    const geom = feature.geometry as Geometry;
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


// TODO: objects sit at a flat elevation. To follow terrain, take
// map.queryTerrainElevation and terrainExaggeration here and add the sampled
// elevation to the z component below.
export const createScenegraphLayer = (
    deckLayerConfig: DeckLayerConfig,
    allGeometries: SampledObject[]
  ) => {
      const layer = new ScenegraphLayer<SampledObject>({
        id: deckLayerConfig.id,
        data: allGeometries,
        scenegraph: deckLayerConfig.modelUrl,
        loaders: [GLTFLoader],
        // position[2] already carries the config's elevationOffset (see GeometrySampler)
        getPosition: (d) => d.position,
        getOrientation: (d) => [0, d.rotation, 90],
        getScale: (d) => [d.scale, d.scale, d.scale],
        sizeScale: 1,
        _lighting: 'pbr',
        pickable: true,
      });

      return layer;
  };

