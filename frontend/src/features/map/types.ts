export enum Location {
  Munich = 'munich',
  Cortina = 'cortina',
}

export enum BuildingStyle {
  Realistic = 'realistic',
  Flat = 'flat',
  Outlined = 'outlined',
}

export enum RoadStyle {
  Default = 'default',
  Minimal = 'minimal',
  Prominent = 'prominent',
}

export enum LanduseStyle {
  Vibrant = 'vibrant',
  Subtle = 'subtle',
  None = 'none',
}

export enum MapStyle {
  Dark = 'dark',
  Light = 'light',
}

export enum LayerType {
  Buildings = 'buildings',
  Roads = 'roads',
  Landuse = 'landuse',
  Terrain = 'terrain',
}

export const LAYER_MAPPING = {
  buildings: ['buildings-fill', 'buildings-3d'],
  roads: ['roads-line'],
  landuse: ['landuse-fill'],
} as const;

export const LAYER_IDS = {
  BUILDINGS_FILL: LAYER_MAPPING.buildings[0],
  BUILDINGS_3D: LAYER_MAPPING.buildings[1],
  ROADS_LINE: LAYER_MAPPING.roads[0],
  LANDUSE_FILL: LAYER_MAPPING.landuse[0],
} as const;

export const MAP_CONFIG = {
  defaultZoom: 12,
  defaultPitch: 45,
  defaultBearing: 0,
} as const;
