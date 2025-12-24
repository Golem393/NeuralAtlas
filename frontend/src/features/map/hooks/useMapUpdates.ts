import { useEffect } from 'react';
import type { MutableRefObject } from 'react';
import type maplibregl from 'maplibre-gl';
import { useMapStore } from '@/stores/mapStore';
import { LAYER_MAPPING } from '../types';
import {
  updateLayerVisibility,
  updateBuildingStyle,
  updateBuildingHeight,
  updateRoadStyle,
  updateLanduseStyle,
} from '../utils/mapUpdaters';

export const useMapUpdates = (
  map: MutableRefObject<maplibregl.Map | null>,
  mapLoaded: MutableRefObject<boolean>
) => {
  const {
    visibleLayers,
    backgroundColor,
    buildingStyle,
    buildingHeight,
    roadStyle,
    landuseStyle,
  } = useMapStore();

  // Update background color
  useEffect(() => {
    if (!map.current || !mapLoaded.current) return;
    
    if (map.current.getLayer('background')) {
      map.current.setPaintProperty('background', 'background-color', backgroundColor);
    }
  }, [backgroundColor, map, mapLoaded]);

  // Update layer visibility
  useEffect(() => {
    if (!map.current || !mapLoaded.current) return;

    Object.entries(visibleLayers).forEach(([layer, visible]) => {
      const layerIds = LAYER_MAPPING[layer as keyof typeof LAYER_MAPPING] || [];
      layerIds.forEach((layerId) => {
        updateLayerVisibility(map.current!, layerId, visible);
      });
    });
  }, [visibleLayers, map, mapLoaded]);

  // Update building styles
  useEffect(() => {
    if (!map.current || !mapLoaded.current || !visibleLayers.buildings) return;

    updateBuildingStyle(map.current, buildingStyle);
    updateBuildingHeight(map.current, buildingHeight);
  }, [buildingStyle, buildingHeight, visibleLayers.buildings, map, mapLoaded]);

  // Update road style
  useEffect(() => {
    if (!map.current || !mapLoaded.current || !visibleLayers.roads) return;

    updateRoadStyle(map.current, roadStyle);
  }, [roadStyle, visibleLayers.roads, map, mapLoaded]);

  // Update landuse style
  useEffect(() => {
    if (!map.current || !mapLoaded.current || !visibleLayers.landuse) return;

    updateLanduseStyle(map.current, landuseStyle);
  }, [landuseStyle, visibleLayers.landuse, map, mapLoaded]);
};
