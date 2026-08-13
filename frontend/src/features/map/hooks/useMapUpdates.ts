import { useEffect } from 'react';
import type { MutableRefObject } from 'react';
import type maplibregl from 'maplibre-gl';
import { useMapStore } from '../store';
import { LAYER_MAPPING } from '../config/mapConfig';
import {
  updateLayerVisibility,
  updateTheme,
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
    mapStyle,
    buildingStyle,
    buildingHeight,
    roadStyle,
    landuseStyle,
    terrainExaggeration,
  } = useMapStore();

  // Apply the theme palette across every layer that carries a colour.
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    updateTheme(map.current, mapStyle);
  }, [mapStyle, map, mapLoaded]);

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

    updateRoadStyle(map.current, roadStyle, mapStyle);
  }, [roadStyle, mapStyle, visibleLayers.roads, map, mapLoaded]);

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