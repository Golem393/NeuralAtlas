export type BuildingStyle = 'realistic' | 'flat' | 'outlined';
export type RoadStyle = 'default' | 'simple' | 'bold';
export type LanduseStyle = 'vibrant' | 'subtle' | 'none';

export const LAYER_MAPPING = {
  buildings: ['buildings-fill', 'buildings-3d'],
  roads: ['roads-line'],
  landuse: ['landuse-fill'],
} as const;

export const MAP_CONFIG = {
  defaultZoom: 12,
  defaultPitch: 45,
  defaultBearing: 0,
} as const;
