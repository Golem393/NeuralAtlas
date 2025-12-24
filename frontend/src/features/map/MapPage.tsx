import { MapView } from '@/components/MapView';
import { LayerToggle } from '@/components/LayerToggle';
import { StyleSelector } from '@/components/StyleSelector';
import { useMapStore } from '@/stores/mapStore';

export const MapPage = () => {
  const {
    layers,
    style,
    setLayers,
    setStyle
  } = useMapStore();

  return (
    <div className="flex h-screen">
      {/* Sidebar Controls */}
      <div className="w-80 bg-gray-50 p-4 space-y-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">NeuralAtlas</h1>

        <LayerToggle
          layers={layers}
          onLayerChange={setLayers}
        />

        <StyleSelector
          style={style}
          onStyleChange={setStyle}
        />
      </div>

      {/* Map View */}
      <div className="flex-1">
        <MapView />
      </div>
    </div>
  );
};
