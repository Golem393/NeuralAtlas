import { create } from 'zustand';
import { BuildingStyle, RoadStyle, LanduseStyle, MapStyle, LayerType, Location } from '@/features/map/types';

interface MapState {
  location: Location;
  bbox: [number, number, number, number];
  visibleLayers: {
    buildings: boolean;
    roads: boolean;
    landuse: boolean;
    terrain: boolean;
  };
  backgroundColor: string;
  mapStyle: MapStyle;
  buildingStyle: BuildingStyle;
  roadStyle: RoadStyle;
  landuseStyle: LanduseStyle;
  buildingHeight: number; // Height multiplier
  terrainExaggeration: number;
  setLocation: (location: Location) => void;
  setBbox: (bbox: [number, number, number, number]) => void;
  toggleLayer: (layer: LayerType) => void;
  setBackgroundColor: (color: string) => void;
  setMapStyle: (style: MapStyle) => void;
  setBuildingStyle: (style: BuildingStyle) => void;
  setRoadStyle: (style: RoadStyle) => void;
  setLanduseStyle: (style: LanduseStyle) => void;
  setBuildingHeight: (height: number) => void;
  setTerrainExaggeration: (exaggeration: number) => void;
}

export const useMapStore = create<MapState>((set) => ({
  location: Location.Munich,
  bbox: [11.4, 48.1, 11.7, 48.2],
  visibleLayers: {
    buildings: true,
    roads: true,
    landuse: true,
    terrain: false,
  },
  backgroundColor: '#1a1a2e',
  mapStyle: MapStyle.Dark,
  buildingStyle: BuildingStyle.Realistic,
  roadStyle: RoadStyle.Default,
  landuseStyle: LanduseStyle.Vibrant,
  buildingHeight: 1.0,
  terrainExaggeration: 1.0,
  setLocation: (location) => set({ location }),
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
  setTerrainExaggeration: (exaggeration) => set({ terrainExaggeration: exaggeration }),
}));
