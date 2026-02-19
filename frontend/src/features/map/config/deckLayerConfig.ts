import type { SamplerConfig, DeckLayerConfig, DeckSourceConfig } from '../types';

const DECK_SOURCES: Record<string, DeckSourceConfig> = {
  forests: {
    sourceId: 'land_physical',
    sourceLayer: 'land_physical',
    filter: (f: GeoJSON.Feature) => 
      f.properties?.class === 'forest' || f.properties?.subclass === 'wood'
  },
  water: {
    sourceId: 'land_physical',
    sourceLayer: 'land_physical',
    filter: (f: GeoJSON.Feature) => f.properties?.class === 'water'
  },
  parks: {
    sourceId: 'landuse_human',
    sourceLayer: 'landuse_human',
    filter: (f: GeoJSON.Feature) => 
      f.properties?.class === 'park' || f.properties?.subclass === 'park'
  },
};

const TREE_SAMPLER: Partial<SamplerConfig> = {
  density: 100000,
  minScale: 6,
  maxScale: 14,
  minRotation: 0,
  maxRotation: 360,
  maxObjects: 500,
  variants: 3,
  elevationOffset: 0,
};

export const DECK_LAYER_CONFIGS: Record<string, DeckLayerConfig> = {
  trees: {
    id: 'trees-3d',
    label: 'Trees',
    type: 'scenegraph',
    sources: [
      DECK_SOURCES.forests,
      // DECK_SOURCES.parks,  // Uncomment to also place trees in parks
    ],
    modelUrl: '/models/tree_small.glb',
    samplerSettings: TREE_SAMPLER,
    minZoom: 13
    }
};




