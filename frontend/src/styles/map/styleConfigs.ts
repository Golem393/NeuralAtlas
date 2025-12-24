import { ROAD_COLORS, ROAD_WIDTHS, LANDUSE_COLORS } from './constants';

export const ROAD_STYLE_CONFIGS = {
  default: {
    color: [
      'match',
      ['get', 'road_class'],
      'motorway', ROAD_COLORS.motorway,
      'trunk', ROAD_COLORS.trunk,
      'primary', ROAD_COLORS.primary,
      'secondary', ROAD_COLORS.secondary,
      'tertiary', ROAD_COLORS.tertiary,
      ROAD_COLORS.default
    ] as any,
    width: [
      'match',
      ['get', 'road_class'],
      'motorway', ROAD_WIDTHS.motorway,
      'trunk', ROAD_WIDTHS.trunk,
      'primary', ROAD_WIDTHS.primary,
      'secondary', ROAD_WIDTHS.secondary,
      'tertiary', ROAD_WIDTHS.tertiary,
      ROAD_WIDTHS.default
    ] as any
  },
  simple: {
    color: '#888888',
    width: 1
  },
  bold: {
    color: '#000000',
    width: [
      'match',
      ['get', 'road_class'],
      'motorway', 6,
      'trunk', 5,
      'primary', 4,
      'secondary', 3,
      'tertiary', 2,
      1.5
    ] as any
  }
};

export const LANDUSE_STYLE_CONFIGS = {
  vibrant: {
    opacity: 0.6,
    color: [
      'match',
      ['get', 'class'],
      'forest', LANDUSE_COLORS.forest,
      'grass', LANDUSE_COLORS.grass,
      'park', LANDUSE_COLORS.park,
      'water', LANDUSE_COLORS.water,
      'residential', LANDUSE_COLORS.residential,
      'commercial', LANDUSE_COLORS.commercial,
      'industrial', LANDUSE_COLORS.industrial,
      LANDUSE_COLORS.default
    ] as any
  },
  subtle: {
    opacity: 0.3,
    color: [
      'match',
      ['get', 'class'],
      'forest', '#d0d0d0',
      'grass', '#e0e0e0',
      'park', '#d8d8d8',
      'water', '#c8c8c8',
      'residential', '#f5f5f5',
      'commercial', '#f0f0f0',
      'industrial', '#e8e8e8',
      '#e0e0e0'
    ] as any
  }
};
