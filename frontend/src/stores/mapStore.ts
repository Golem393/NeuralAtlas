import { create } from 'zustand';
import { DataSource } from '@/types/mapConfig';
import type { LayerConfig, MapStyleConfig } from '@/types/mapConfig';

interface MapState {
  selectedSource: DataSource;
  layers: LayerConfig;
  style: MapStyleConfig;
  bbox: [number, number, number, number];

  setSource: (source: DataSource) => void;
  setLayers: (layers: LayerConfig) => void;
  setStyle: (style: MapStyleConfig) => void;
  setBbox: (bbox: [number, number, number, number]) => void;
}

export const useMapStore = create<MapState>((set : (partial: Partial<MapState>) => void) => ({
  selectedSource: DataSource.OVERTURE,
  layers: {
    show_buildings: true,
    show_roads: true,
    show_landuse: true,
  },
  style: {
    background_color: '#f0f0f0',
    building_color: '#cccccc',
    road_color: '#ffffff',
    water_color: '#a0c8f0',
  },
  bbox: [11.4, 48.1, 11.7, 48.2], // Munich area

  setSource: (source : DataSource) => set({ selectedSource: source }),
  setLayers: (layers: LayerConfig) => set({ layers }),
  setStyle: (style: MapStyleConfig) => set({ style }),
  setBbox: (bbox: [number, number, number, number]) => set({ bbox }),
}));
