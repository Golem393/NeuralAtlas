import type maplibregl from 'maplibre-gl';
import { ROAD_STYLE_CONFIGS, LANDUSE_STYLE_CONFIGS } from '../styles/styleConfigs';
import { BUILDING_HEIGHT } from '../styles/constants';
import { BuildingStyle, RoadStyle, LanduseStyle } from '../types';
import { LAYER_IDS } from '../config/mapConfig';

export const updateLayerVisibility = (map: maplibregl.Map, layerId: string, visible: boolean) => {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
  }
};

export const updateBuildingStyle = (map: maplibregl.Map, style: BuildingStyle) => {
  if (style === BuildingStyle.Flat) {
    updateLayerVisibility(map, LAYER_IDS.BUILDINGS_3D, false);
    updateLayerVisibility(map, LAYER_IDS.BUILDINGS_FILL, true);
    map.setPaintProperty(LAYER_IDS.BUILDINGS_FILL, 'fill-opacity', 1);
  } else if (style === BuildingStyle.Outlined) {
    updateLayerVisibility(map, LAYER_IDS.BUILDINGS_3D, true);
    map.setPaintProperty(LAYER_IDS.BUILDINGS_3D, 'fill-extrusion-opacity', 0.7);
  } else {
    updateLayerVisibility(map, LAYER_IDS.BUILDINGS_3D, true);
    updateLayerVisibility(map, LAYER_IDS.BUILDINGS_FILL, false);
    map.setPaintProperty(LAYER_IDS.BUILDINGS_3D, 'fill-extrusion-opacity', 0.9);
  }
};

export const updateBuildingHeight = (map: maplibregl.Map, multiplier: number) => {
  if (!map.getLayer(LAYER_IDS.BUILDINGS_3D)) return;

  const heightExpression: maplibregl.ExpressionSpecification = [
    '*',
    multiplier,
    [
      'case',
      ['>', ['get', 'height'], 0],
      ['get', 'height'],
      ['has', 'num_floors'],
      ['*', ['get', 'num_floors'], BUILDING_HEIGHT.metersPerFloor],
      BUILDING_HEIGHT.default,
    ],
  ];

  map.setPaintProperty(LAYER_IDS.BUILDINGS_3D, 'fill-extrusion-height', heightExpression);
};

export const updateRoadStyle = (map: maplibregl.Map, style: RoadStyle) => {
  if (!map.getLayer(LAYER_IDS.ROADS_LINE)) return;

  const config = ROAD_STYLE_CONFIGS[style];
  map.setPaintProperty(LAYER_IDS.ROADS_LINE, 'line-color', config.color);
  map.setPaintProperty(LAYER_IDS.ROADS_LINE, 'line-width', config.width);
};

export const updateLanduseStyle = (map: maplibregl.Map, style: LanduseStyle) => {
  if (!map.getLayer(LAYER_IDS.LANDUSE_FILL)) return;

  if (style === LanduseStyle.None) {
    updateLayerVisibility(map, LAYER_IDS.LANDUSE_FILL, false);
  } else {
    updateLayerVisibility(map, LAYER_IDS.LANDUSE_FILL, true);
    const config = LANDUSE_STYLE_CONFIGS[style];
    map.setPaintProperty(LAYER_IDS.LANDUSE_FILL, 'fill-opacity', config.opacity);
    map.setPaintProperty(LAYER_IDS.LANDUSE_FILL, 'fill-color', config.color);
  }
};

export const updateTerrainExaggeration = (map: maplibregl.Map, exaggeration: number) => {
    map.setTerrain({
      source: 'terrarium-terrain',
      exaggeration,
    });
};
