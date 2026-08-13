import { MapStyle } from '../types';


export const ROAD_WIDTHS = {
  motorway: 6,
  trunk: 5,
  primary: 4,
  secondary: 3,
  tertiary: 2,
  default: 1.5,
};

export const BUILDING_HEIGHT = {
  default: 8,
  metersPerFloor: 3.5,
};
export interface ThemePalette {
  background: string;
  /** classes from the Overture `land_use` theme */
  landuse: {
    green: string;
    forest: string;
    recreation: string;
    residential: string;
    commercial: string;
    industrial: string;
    paved: string;
    default: string;
  };
  /** classes from the Overture `land` theme */
  landPhysical: {
    forest: string;
    grassland: string;
    scrub: string;
    rock: string;
    scree: string;
    sand: string;
    wetland: string;
    glacier: string;
    default: string;
  };
  road: {
    motorway: string;
    trunk: string;
    primary: string;
    secondary: string;
    tertiary: string;
    /** residential, living_street, unclassified, service */
    minor: string;
    /** footway, path, cycleway, track, steps */
    path: string;
    default: string;
  };
  building: {
    fill: string;
    extrusion: string;
  };
}

export const THEME_COLORS: Record<MapStyle, ThemePalette> = {
  [MapStyle.Dark]: {
    background: '#1a1a2e',
    landuse: {
      green: '#2f5f43',
      forest: '#2d5a3f',
      recreation: '#376b52',
      residential: '#2a2d3a',
      commercial: '#3a2d3a',
      industrial: '#4a3d3a',
      paved: '#33333f',
      default: '#252530',
    },
    landPhysical: {
      forest: '#274f38',
      grassland: '#356047',
      scrub: '#3d5940',
      rock: '#4a4a55',
      scree: '#565663',
      sand: '#5c5648',
      wetland: '#2b4a52',
      glacier: '#6a7a8c',
      default: '#242430',
    },
    road: {
      motorway: '#ff8c69',
      trunk: '#ffa07a',
      primary: '#ffb380',
      secondary: '#c4c4d4',
      tertiary: '#a0a0b0',
      minor: '#7c7c8c',
      path: '#5f5f6e',
      default: '#808090',
    },
    building: {
      fill: '#3a4a5a',
      extrusion: '#4a5a6a',
    },
  },
  [MapStyle.Light]: {
    background: '#f4f1ea',
    landuse: {
      green: '#cfe5c0',
      forest: '#c2ddb4',
      recreation: '#d8ecc8',
      residential: '#e8e3d9',
      commercial: '#efe1e0',
      industrial: '#e4ded5',
      paved: '#eae7e0',
      default: '#ece8df',
    },
    landPhysical: {
      forest: '#c1dcb2',
      grassland: '#d8e9c5',
      scrub: '#dadfbd',
      rock: '#dedad2',
      scree: '#e7e3dc',
      sand: '#eee3c9',
      wetland: '#cfe0e2',
      glacier: '#e4eef5',
      default: '#eeeae1',
    },
    road: {
      motorway: '#e08a4a',
      trunk: '#eda468',
      primary: '#f3c489',
      secondary: '#9aa0a6',
      tertiary: '#b4b9be',
      minor: '#c6cacd',
      path: '#d3d0c8',
      default: '#c6cacd',
    },
    building: {
      fill: '#d8d1c6',
      extrusion: '#cac2b5',
    },
  },
};
