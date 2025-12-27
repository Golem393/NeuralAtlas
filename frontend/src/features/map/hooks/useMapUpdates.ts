import { useEffect } from 'react';
import type { MutableRefObject } from 'react';
import type maplibregl from 'maplibre-gl';
import { useMapStore } from '@/stores/mapStore';
import { LAYER_MAPPING, MapStyle } from '../types';
import {
  updateLayerVisibility,
  updateBuildingStyle,
  updateBuildingHeight,
  updateRoadStyle,
  updateLanduseStyle,
  updateTerrainExaggeration,
} from '../utils/mapUpdaters';

export const useMapUpdates = (
  map: MutableRefObject<maplibregl.Map | null>,
  mapLoaded: boolean,
  terrainSourceLoaded: boolean
) => {
  const {
    visibleLayers,
    backgroundColor,
    mapStyle,
    buildingStyle,
    buildingHeight,
    roadStyle,
    landuseStyle,
    terrainExaggeration,
  } = useMapStore();

  // Update map style (background color)
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const bgColor = mapStyle === MapStyle.Dark ? '#1a1a2e' : '#f0f0f0';
    if (map.current.getLayer('background')) {
      map.current.setPaintProperty('background', 'background-color', bgColor);
    }
  }, [mapStyle, map, mapLoaded]);

  // Update background color
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (map.current.getLayer('background')) {
      map.current.setPaintProperty('background', 'background-color', backgroundColor);
    }
  }, [backgroundColor, map, mapLoaded]);

  // Update layer visibility
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    Object.entries(visibleLayers).forEach(([layer, visible]) => {
      const layerIds = LAYER_MAPPING[layer as keyof typeof LAYER_MAPPING] || [];
      layerIds.forEach((layerId) => {
        updateLayerVisibility(map.current!, layerId, visible);
      });
    });
  }, [visibleLayers, map, mapLoaded]);

  // Update building styles
  useEffect(() => {
    if (!map.current || !mapLoaded || !visibleLayers.buildings) return;

    updateBuildingStyle(map.current, buildingStyle);
    updateBuildingHeight(map.current, buildingHeight);
  }, [buildingStyle, buildingHeight, visibleLayers.buildings, map, mapLoaded]);

  // Update road style
  useEffect(() => {
    if (!map.current || !mapLoaded || !visibleLayers.roads) return;

    updateRoadStyle(map.current, roadStyle);
  }, [roadStyle, visibleLayers.roads, map, mapLoaded]);

  // Update landuse style
  useEffect(() => {
    if (!map.current || !mapLoaded || !visibleLayers.landuse) return;

    updateLanduseStyle(map.current, landuseStyle);
  }, [landuseStyle, visibleLayers.landuse, map, mapLoaded]);

  // Update terrain
  useEffect(() => {
    if (!map.current || !mapLoaded || !terrainSourceLoaded) return;
    if (visibleLayers.terrain){
      updateTerrainExaggeration(map.current, terrainExaggeration);
    } else {
      map.current.setTerrain(null);
    }
  }, [terrainExaggeration, visibleLayers.terrain, map, mapLoaded, terrainSourceLoaded]);
};