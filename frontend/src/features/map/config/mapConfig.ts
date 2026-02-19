import { Location } from '../types';
import type { BBox } from '../lib/mapGeometry/types';

export const LOCATION_CONFIG = {
  [Location.Munich]: {
    center: [11.576124, 48.137154] as [number, number],
    zoom: 12,
    bbox: [11.4, 48.1, 11.7, 48.2] as BBox,
  },
  [Location.Cortina]: {
    center: [12.1389, 46.5369] as [number, number],
    zoom: 13,
    bbox: [12.0, 46.4, 12.3, 46.6] as BBox,
  },
};

export const PMTILES_SOURCES = {
  [Location.Munich]: {
    buildings: 'pmtiles:///data/munich_buildings.pmtiles',
    roads: 'pmtiles:///data/munich_roads.pmtiles',
    landuse_human: 'pmtiles:///data/munich_landuse_human.pmtiles',
    land_physical: 'pmtiles:///data/munich_land_physical.pmtiles',
  },
  [Location.Cortina]: {
    buildings: 'pmtiles:///data/dolomites_buildings.pmtiles',
    roads: 'pmtiles:///data/dolomites_roads.pmtiles',
    landuse_human: 'pmtiles:///data/dolomites_landuse_human.pmtiles',
    land_physical: 'pmtiles:///data/dolomites_land_physical.pmtiles',
  },
};

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

export const MAP_DEFAULT_ORIENTATION = {
  defaultZoom: 12,
  defaultPitch: 45,
  defaultBearing: 0,
} as const;
