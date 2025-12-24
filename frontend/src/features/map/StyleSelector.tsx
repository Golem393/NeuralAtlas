import { useMapStore } from '@/stores/mapStore';
import type { BuildingStyle } from './types';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { ColorPicker } from '@/components/ui/ColorPicker';

export const StyleSelector = () => {
  const {
    buildingStyle,
    buildingHeight,
    backgroundColor,
    setBuildingStyle,
    setBuildingHeight,
    setBackgroundColor,
  } = useMapStore();

  return (
    <div>
      <h3 className="mb-[10px] text-[14px]">Styling</h3>
      <div className="flex flex-col gap-[15px]">
        <Select
          label="Building Style"
          value={buildingStyle}
          onChange={(value) => setBuildingStyle(value as BuildingStyle)}
          options={[
            { value: 'realistic', label: '3D Realistic' },
            { value: 'flat', label: 'Flat' },
            { value: 'outlined', label: 'Outlined' },
          ]}
        />

        <Slider
          label="Building Height"
          value={buildingHeight}
          min={0.5}
          max={3}
          step={0.1}
          onChange={setBuildingHeight}
          formatValue={(v) => `${v.toFixed(1)}x`}
        />

        <ColorPicker
          label="Background Color"
          value={backgroundColor}
          onChange={setBackgroundColor}
        />
      </div>
    </div>
  );
};
