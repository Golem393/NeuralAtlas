import { THEME_COLORS, ROAD_WIDTHS } from './constants';
import { MapStyle, RoadStyle, LanduseStyle } from '../types';
import type { ExpressionSpecification } from 'maplibre-gl';


const roadColor = (theme: MapStyle): ExpressionSpecification => {
  const c = THEME_COLORS[theme].road;

  return [
    'match',
    ['get', 'class'],
    'motorway',
    c.motorway,
    'trunk',
    c.trunk,
    'primary',
    c.primary,
    'secondary',
    c.secondary,
    'tertiary',
    c.tertiary,
    ['residential', 'living_street', 'unclassified', 'service'],
    c.minor,
    ['footway', 'path', 'cycleway', 'track', 'steps', 'bridleway', 'pedestrian'],
    c.path,
    c.default,
  ] as ExpressionSpecification;
};

const roadWidth = (scale: number): ExpressionSpecification =>
  [
    'match',
    ['get', 'class'],
    'motorway',
    ROAD_WIDTHS.motorway * scale,
    'trunk',
    ROAD_WIDTHS.trunk * scale,
    'primary',
    ROAD_WIDTHS.primary * scale,
    'secondary',
    ROAD_WIDTHS.secondary * scale,
    'tertiary',
    ROAD_WIDTHS.tertiary * scale,
    ['residential', 'living_street', 'unclassified', 'service'],
    ROAD_WIDTHS.default * scale,
    ['footway', 'path', 'cycleway', 'track', 'steps', 'bridleway', 'pedestrian'],
    ROAD_WIDTHS.default * scale * 0.6,
    ROAD_WIDTHS.default * scale * 0.6,
  ] as ExpressionSpecification;

export const getRoadStyleConfig = (theme: MapStyle, style: RoadStyle) => {
  const scale =
    style === RoadStyle.Minimal ? 0.35 : style === RoadStyle.Prominent ? 1.6 : 1;

  return {
    color: style === RoadStyle.Minimal ? THEME_COLORS[theme].road.minor : roadColor(theme),
    width: roadWidth(scale),
  };
};


export const LANDUSE_OPACITY: Record<Exclude<LanduseStyle, LanduseStyle.None>, number> = {
  [LanduseStyle.Vibrant]: 0.9,
  [LanduseStyle.Subtle]: 0.3,
};

export const getLanduseColor = (theme: MapStyle): ExpressionSpecification => {
  const c = THEME_COLORS[theme].landuse;

  return [
    'match',
    ['get', 'class'],
    ['forest', 'wood'],
    c.forest,
    [
      'park',
      'garden',
      'flowerbed',
      'national_park',
      'species_management_area',
      'grass',
      'meadow',
      'cemetery',
      'vineyard',
      'orchard',
      'farmland',
      'golf_course',
    ],
    c.green,
    ['pitch', 'playground', 'track', 'winter_sports', 'downhill', 'nordic', 'camp_site', 'recreation_ground'],
    c.recreation,
    ['residential'],
    c.residential,
    ['commercial', 'retail'],
    c.commercial,
    ['industrial', 'quarry', 'military', 'construction'],
    c.industrial,
    ['plaza', 'pedestrian', 'connection'],
    c.paved,
    c.default,
  ] as ExpressionSpecification;
};

export const getLandPhysicalColor = (theme: MapStyle): ExpressionSpecification => {
  const c = THEME_COLORS[theme].landPhysical;

  return [
    'match',
    ['get', 'class'],
    ['forest', 'wood', 'tree'],
    c.forest,
    ['grassland', 'grass', 'meadow', 'heath'],
    c.grassland,
    ['scrub'],
    c.scrub,
    ['bare_rock', 'rock', 'cliff'],
    c.rock,
    ['scree', 'shingle'],
    c.scree,
    ['sand', 'beach', 'dune'],
    c.sand,
    ['wetland', 'marsh', 'swamp'],
    c.wetland,
    ['glacier'],
    c.glacier,
    c.default,
  ] as ExpressionSpecification;
};
