import type { MapStyleConfig } from '@/types/mapConfig';

interface StyleSelectorProps {
  style: MapStyleConfig;
  onStyleChange: (style: MapStyleConfig) => void;
}

export const StyleSelector = ({ style, onStyleChange }: StyleSelectorProps) => {
  const presets = [
    { name: 'Light', bg: '#f0f0f0', building: '#cccccc' },
    { name: 'Dark', bg: '#1a1a1a', building: '#404040' },
    { name: 'Satellite', bg: '#2a3f2f', building: '#8b7355' },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    onStyleChange({
      ...style,
      background_color: preset.bg,
      building_color: preset.building,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-sm font-medium mb-3">Map Style</h3>
      <div className="flex gap-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <label className="block text-xs">
          Background
          <input
            type="color"
            value={style.background_color}
            onChange={(e) => onStyleChange({
              ...style,
              background_color: e.target.value
            })}
            className="ml-2"
          />
        </label>
      </div>
    </div>
  );
};
