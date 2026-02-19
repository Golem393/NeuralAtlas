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

export interface SamplerConfig {
  density: number;
  minScale: number;
  maxScale: number;
  minRotation: number;
  maxRotation: number;
  maxObjects: number;
  jitter: number;
  variants?: number;
  seed?: string;
  elevationOffset?: number;
}

export interface DeckSourceConfig {
  sourceId: string;
  sourceLayer: string;
  filter: (feature: GeoJSON.Feature) => boolean;
}

export interface DeckLayerConfig {
  id: string;
  label: string;
  type: 'scenegraph' | 'scatter';
  sources: DeckSourceConfig[]; 
  modelUrl: string;
  samplerSettings: Partial<SamplerConfig>;
  minZoom?: number;
  maxZoom?: number;
}
