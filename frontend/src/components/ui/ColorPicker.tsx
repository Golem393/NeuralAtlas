import type { JSX } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker = ({ label, value, onChange }: ColorPickerProps): JSX.Element => {
  return (
    <div>
      <label className="block mb-[5px] text-[12px]">
        {label}
      </label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[30px]"
      />
    </div>
  );
};
