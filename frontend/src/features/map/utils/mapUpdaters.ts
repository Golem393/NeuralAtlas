import type maplibregl from 'maplibre-gl';
import {
  getRoadStyleConfig,
  getLanduseColor,
  getLandPhysicalColor,
  LANDUSE_OPACITY,
} from '../styles/styleConfigs';
import { BUILDING_HEIGHT, THEME_COLORS } from '../styles/constants';
import { BuildingStyle, RoadStyle, LanduseStyle, MapStyle } from '../types';
import { LAYER_IDS } from '../config/mapConfig';

export const updateLayerVisibility = (map: maplibregl.Map, layerId: string, visible: boolean) => {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
  }
};


export const updateTheme = (map: maplibregl.Map, theme: MapStyle) => {
  const palette = THEME_COLORS[theme];

  if (map.getLayer('background')) {
    map.setPaintProperty('background', 'background-color', palette.background);
  }
  if (map.getLayer(LAYER_IDS.LANDUSE_FILL)) {
    map.setPaintProperty(LAYER_IDS.LANDUSE_FILL, 'fill-color', getLanduseColor(theme));
  }
  if (map.getLayer(LAYER_IDS.LAND_PHYSICAL_FILL)) {
    map.setPaintProperty(LAYER_IDS.LAND_PHYSICAL_FILL, 'fill-color', getLandPhysicalColor(theme));
  }
  if (map.getLayer(LAYER_IDS.BUILDINGS_FILL)) {
    map.setPaintProperty(LAYER_IDS.BUILDINGS_FILL, 'fill-color', palette.building.fill);
  }
  if (map.getLayer(LAYER_IDS.BUILDINGS_3D)) {
    map.setPaintProperty(LAYER_IDS.BUILDINGS_3D, 'fill-extrusion-color', palette.building.extrusion);
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

export const updateRoadStyle = (map: maplibregl.Map, style: RoadStyle, theme: MapStyle) => {
  if (!map.getLayer(LAYER_IDS.ROADS_LINE)) return;

  const config = getRoadStyleConfig(theme, style);
  map.setPaintProperty(LAYER_IDS.ROADS_LINE, 'line-color', config.color);
  map.setPaintProperty(LAYER_IDS.ROADS_LINE, 'line-width', config.width);
};

export const updateLanduseStyle = (map: maplibregl.Map, style: LanduseStyle) => {
  const layerIds = [LAYER_IDS.LANDUSE_FILL, LAYER_IDS.LAND_PHYSICAL_FILL];

  if (style === LanduseStyle.None) {
    layerIds.forEach((id) => updateLayerVisibility(map, id, false));
    return;
  }

  // Both fills share the preset opacity. land-physical in particular must not
  // sit at full opacity: it covers the entire viewport in mountain regions and
  // would hide everything painted beneath it.
  const opacity = LANDUSE_OPACITY[style];
  layerIds.forEach((id) => {
    if (!map.getLayer(id)) return;
    updateLayerVisibility(map, id, true);
    map.setPaintProperty(id, 'fill-opacity', opacity);
  });
};

export const updateTerrainExaggeration = (map: maplibregl.Map, exaggeration: number) => {
    map.setTerrain({
      source: 'terrarium-terrain',
      exaggeration,
    });
};
