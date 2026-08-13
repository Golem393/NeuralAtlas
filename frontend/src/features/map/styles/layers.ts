import type { LayerSpecification } from 'maplibre-gl';
import { THEME_COLORS, BUILDING_HEIGHT } from './constants';
import { getLanduseColor, getLandPhysicalColor, getRoadStyleConfig, LANDUSE_OPACITY } from './styleConfigs';
import { MapStyle, RoadStyle, LanduseStyle } from '../types';

export const createMapLayers = (theme: MapStyle = MapStyle.Dark): LayerSpecification[] => {
  const palette = THEME_COLORS[theme];
  const road = getRoadStyleConfig(theme, RoadStyle.Default);
  const landuseOpacity = LANDUSE_OPACITY[LanduseStyle.Vibrant];

  return [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': palette.background,
      },
    },
    {
      id: 'landuse-fill',
      type: 'fill',
      source: 'landuse_human',
      'source-layer': 'landuse_human',
      paint: {
        'fill-color': getLanduseColor(theme),
        'fill-opacity': landuseOpacity,
      },
    },
    {
      // Physical land covers the whole viewport in mountain regions, so it must
      // stay translucent — at full opacity it hides the background and every
      // layer beneath it, making the theme and landuse controls look inert.
      id: 'land-physical-fill',
      type: 'fill',
      source: 'land_physical',
      'source-layer': 'land_physical',
      paint: {
        'fill-color': getLandPhysicalColor(theme),
        'fill-opacity': landuseOpacity,
      },
    },
    {
      id: 'roads-line',
      type: 'line',
      source: 'roads',
      'source-layer': 'roads',
      paint: {
        'line-color': road.color,
        'line-width': road.width,
        'line-opacity': 0.9,
      },
    },
    {
      id: 'buildings-fill',
      type: 'fill',
      source: 'buildings',
      'source-layer': 'buildings',
      paint: {
        'fill-color': palette.building.fill,
        'fill-opacity': 0.9,
      },
    },
    {
      id: 'buildings-3d',
      type: 'fill-extrusion',
      source: 'buildings',
      'source-layer': 'buildings',
      paint: {
        'fill-extrusion-color': palette.building.extrusion,
        'fill-extrusion-height': [
          'case',
          ['>', ['get', 'height'], 0],
          ['get', 'height'],
          ['has', 'num_floors'],
          ['*', ['get', 'num_floors'], BUILDING_HEIGHT.metersPerFloor],
          BUILDING_HEIGHT.default,
        ],
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.95,
      },
    },
  ];
};
