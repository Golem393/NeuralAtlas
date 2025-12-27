import { create } from 'zustand';
import { BuildingStyle, RoadStyle, LanduseStyle, MapStyle, LayerType } from '@/features/map/types';

interface MapState {
  bbox: [number, number, number, number];
  visibleLayers: {
    buildings: boolean;
    roads: boolean;
    landuse: boolean;
  };
  backgroundColor: string;
  mapStyle: MapStyle;
  buildingStyle: BuildingStyle;
  roadStyle: RoadStyle;
  landuseStyle: LanduseStyle;
  buildingHeight: number; // Height multiplier
  setBbox: (bbox: [number, number, number, number]) => void;
  toggleLayer: (layer: LayerType) => void;
  setBackgroundColor: (color: string) => void;
  setMapStyle: (style: MapStyle) => void;
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
  backgroundColor: '#1a1a2e',
  mapStyle: MapStyle.Dark,
  buildingStyle: BuildingStyle.Realistic,
  roadStyle: RoadStyle.Default,
  landuseStyle: LanduseStyle.Vibrant,
  buildingHeight: 1.0,
  setBbox: (bbox) => set({ bbox }),
  toggleLayer: (layer) =>
    set((state) => ({
      visibleLayers: {
        ...state.visibleLayers,
        [layer]: !state.visibleLayers[layer],
      },
    })),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setMapStyle: (style) => set({ mapStyle: style }),
  setBuildingStyle: (style) => set({ buildingStyle: style }),
  setRoadStyle: (style) => set({ roadStyle: style }),
  setLanduseStyle: (style) => set({ landuseStyle: style }),
  setBuildingHeight: (height) => set({ buildingHeight: height }),
}));
