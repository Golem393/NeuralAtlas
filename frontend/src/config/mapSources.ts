import { Location } from '@/features/map/types';

export const LOCATION_CONFIG = {
  [Location.Munich]: {
    center: [11.576124, 48.137154] as [number, number],
    zoom: 12,
    bbox: [11.4, 48.1, 11.7, 48.2] as [number, number, number, number],
  },
  [Location.Cortina]: {
    center: [12.1389, 46.5369] as [number, number],
    zoom: 13,
    bbox: [12.0, 46.4, 12.3, 46.6] as [number, number, number, number],
  },
};

export const PMTILES_SOURCES = {
  [Location.Munich]: {
    buildings: 'pmtiles:///data/munich_buildings.pmtiles',
    roads: 'pmtiles:///data/munich_roads.pmtiles',
    landuse: 'pmtiles:///data/munich_landuse.pmtiles',
  },
  [Location.Cortina]: {
    buildings: 'pmtiles:///data/dolomites_buildings.pmtiles',
    roads: 'pmtiles:///data/dolomites_roads.pmtiles',
    landuse: 'pmtiles:///data/dolomites_landuse.pmtiles',
  },
};
