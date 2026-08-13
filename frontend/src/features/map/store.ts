import { create } from 'zustand';
import { BuildingStyle, RoadStyle, LanduseStyle, MapStyle, LayerType, Location } from './types';
import type { BBox } from './lib/mapGeometry/types';

interface MapState {
  location: Location;
  bbox: BBox;
  visibleLayers: {
    buildings: boolean;
    roads: boolean;
    landuse: boolean;
    terrain: boolean;
  };
  mapStyle: MapStyle;
  buildingStyle: BuildingStyle;
  roadStyle: RoadStyle;
  landuseStyle: LanduseStyle;
  buildingHeight: number; // Height multiplier
  terrainExaggeration: number;
  activeDeckGLLayers: string[];
  setLocation: (location: Location) => void;
  setBbox: (bbox: BBox) => void;
  toggleLayer: (layer: LayerType) => void;
  setMapStyle: (style: MapStyle) => void;
  setBuildingStyle: (style: BuildingStyle) => void;
  setRoadStyle: (style: RoadStyle) => void;
  setLanduseStyle: (style: LanduseStyle) => void;
  setBuildingHeight: (height: number) => void;
  setTerrainExaggeration: (exaggeration: number) => void;
  addActiveDeckGLLayers: (layerNames: string[]) => void;
  removeActiveDeckGLLayers: (layerNames: string[]) => void;
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
  mapStyle: MapStyle.Dark,
  buildingStyle: BuildingStyle.Realistic,
  roadStyle: RoadStyle.Default,
  landuseStyle: LanduseStyle.Vibrant,
  buildingHeight: 1.0,
  terrainExaggeration: 1.0,
  activeDeckGLLayers: ["trees"],
  setLocation: (location) => set({ location }),
  setBbox: (bbox) => set({ bbox }),
  toggleLayer: (layer) =>
    set((state) => ({
      visibleLayers: {
        ...state.visibleLayers,
        [layer]: !state.visibleLayers[layer],
      },
    })),
  setMapStyle: (style) => set({ mapStyle: style }),
  setBuildingStyle: (style) => set({ buildingStyle: style }),
  setRoadStyle: (style) => set({ roadStyle: style }),
  setLanduseStyle: (style) => set({ landuseStyle: style }),
  setBuildingHeight: (height) => set({ buildingHeight: height }),
  setTerrainExaggeration: (exaggeration) => set({ terrainExaggeration: exaggeration }),
  addActiveDeckGLLayers: (layerNames) => set((state) => ({
    activeDeckGLLayers: Array.from(new Set([...state.activeDeckGLLayers, ...layerNames])),
  })),
  removeActiveDeckGLLayers: (layerNames) => set((state) => ({
    activeDeckGLLayers: state.activeDeckGLLayers.filter(name => !layerNames.includes(name)),
  })),
}));
