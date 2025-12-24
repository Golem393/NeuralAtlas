export const DataSource = {
  OVERTURE: 'overture',
  OSM: 'osm'
} as const;

export type DataSource = typeof DataSource[keyof typeof DataSource];

export const LayerType = {
  BUILDINGS: 'buildings',
  ROADS: 'roads',
  LANDUSE: "landuse"
} as const;

export type LayerType = typeof LayerType[keyof typeof LayerType];

export interface MapStyleConfig {
  background_color: string;
  building_color: string;
  road_color: string;
  water_color: string;
}

export interface LayerConfig {
  show_buildings: boolean;
  show_roads: boolean;
  show_landuse: boolean;
}

export interface MapConfigRequest {
  map_source: DataSource;
  layers: LayerConfig;
  style: MapStyleConfig;
  bbox: [number, number, number, number]; // [min_lon, min_lat, max_lon, max_lat]
}

export interface TileConfigResponse {
  tile_url: string;
  style_json: Record<string, any>;
  layers_enabled: LayerType[];
}