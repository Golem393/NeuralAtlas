import type { LayerConfig } from '@/types/mapConfig';

interface LayerToggleProps {
  layers: LayerConfig;
  onLayerChange: (layers: LayerConfig) => void;
}

export const LayerToggle = ({ layers, onLayerChange }: LayerToggleProps) => {
  const toggleLayer = (key: keyof LayerConfig) => {
    onLayerChange({ ...layers, [key]: !layers[key] });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
      <h3 className="text-sm font-medium mb-3">Visible Layers</h3>
      
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={layers.show_buildings}
          onChange={() => toggleLayer('show_buildings')}
          className="rounded"
        />
        <span className="text-sm">Buildings</span>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={layers.show_roads}
          onChange={() => toggleLayer('show_roads')}
          className="rounded"
        />
        <span className="text-sm">Roads</span>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={layers.show_landuse}
          onChange={() => toggleLayer('show_landuse')}
          className="rounded"
        />
        <span className="text-sm">Land Use (Water, Parks, etc.)</span>
      </label>
    </div>
  );
};