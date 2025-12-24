import type maplibregl from 'maplibre-gl';
import { ROAD_STYLE_CONFIGS, LANDUSE_STYLE_CONFIGS } from '@/styles/map/styleConfigs';
import { BUILDING_HEIGHT } from '@/styles/map/constants';
import type { BuildingStyle, RoadStyle, LanduseStyle } from '../types';

export const updateLayerVisibility = (
  map: maplibregl.Map,
  layerId: string,
  visible: boolean
) => {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
  }
};

export const updateBuildingStyle = (
  map: maplibregl.Map,
  style: BuildingStyle
) => {
  if (style === 'flat') {
    updateLayerVisibility(map, 'buildings-3d', false);
    updateLayerVisibility(map, 'buildings-fill', true);
    map.setPaintProperty('buildings-fill', 'fill-opacity', 1);
  } else if (style === 'outlined') {
    updateLayerVisibility(map, 'buildings-3d', true);
    map.setPaintProperty('buildings-3d', 'fill-extrusion-opacity', 0.7);
  } else {
    updateLayerVisibility(map, 'buildings-3d', true);
    updateLayerVisibility(map, 'buildings-fill', false);
    map.setPaintProperty('buildings-3d', 'fill-extrusion-opacity', 0.9);
  }
};

export const updateBuildingHeight = (
  map: maplibregl.Map,
  multiplier: number
) => {
  if (!map.getLayer('buildings-3d')) return;
  
  const heightExpression = [
    '*', multiplier,
    [
      'case', 
      ['>', ['get', 'height'], 0], ['get', 'height'],
      ['has', 'num_floors'], ['*', ['get', 'num_floors'], BUILDING_HEIGHT.metersPerFloor],
      BUILDING_HEIGHT.default
    ]
  ] as any;
  
  map.setPaintProperty('buildings-3d', 'fill-extrusion-height', heightExpression);
};

export const updateRoadStyle = (
  map: maplibregl.Map,
  style: RoadStyle
) => {
  if (!map.getLayer('roads-line')) return;

  const config = ROAD_STYLE_CONFIGS[style];
  map.setPaintProperty('roads-line', 'line-color', config.color);
  map.setPaintProperty('roads-line', 'line-width', config.width);
};

export const updateLanduseStyle = (
  map: maplibregl.Map,
  style: LanduseStyle
) => {
  if (!map.getLayer('landuse-fill')) return;

  if (style === 'none') {
    updateLayerVisibility(map, 'landuse-fill', false);
  } else {
    updateLayerVisibility(map, 'landuse-fill', true);
    const config = LANDUSE_STYLE_CONFIGS[style];
    map.setPaintProperty('landuse-fill', 'fill-opacity', config.opacity);
    map.setPaintProperty('landuse-fill', 'fill-color', config.color);
  }
};