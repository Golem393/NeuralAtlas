import { create } from 'zustand';
import type { BuildingStyle, RoadStyle, LanduseStyle } from '@/features/map/types';

interface MapState {
  bbox: [number, number, number, number];
  visibleLayers: {
    buildings: boolean;
    roads: boolean;
    landuse: boolean;
  };
  backgroundColor: string;
  buildingStyle: BuildingStyle;
  roadStyle: RoadStyle;
  landuseStyle: LanduseStyle;
  buildingHeight: number;  // Height multiplier
  setBbox: (bbox: [number, number, number, number]) => void;
  toggleLayer: (layer: 'buildings' | 'roads' | 'landuse') => void;
  setBackgroundColor: (color: string) => void;
  setBuildingStyle: (style: BuildingStyle) => void;
  setRoadStyle: (style: RoadStyle) => void;
  setLanduseStyle: (style: LanduseStyle) => void;
  setBuildingHeight: (height: number) => void;
}

export const useMapStore = create<MapState>((set) => ({
  bbox: [11.4, 48.1, 11.7, 48.2],
  visibleLayers: {
    buildings: true,
    roads: true,
    landuse: true,
  },
  backgroundColor: '#f0f0f0',
  buildingStyle: 'realistic',
  roadStyle: 'default',
  landuseStyle: 'vibrant',
  buildingHeight: 1.0,
  setBbox: (bbox) => set({ bbox }),
  toggleLayer: (layer) => set((state) => ({
    visibleLayers: {
      ...state.visibleLayers,
      [layer]: !state.visibleLayers[layer],
    },
  })),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setBuildingStyle: (style) => set({ buildingStyle: style }),
  setRoadStyle: (style) => set({ roadStyle: style }),
  setLanduseStyle: (style) => set({ landuseStyle: style }),
  setBuildingHeight: (height) => set({ buildingHeight: height }),
}));
