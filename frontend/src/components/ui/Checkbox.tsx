import type { JSX } from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox = ({ label, checked, onChange }: CheckboxProps): JSX.Element => {
  return (
    <div className="mb-[8px]">
      <label className="flex items-center gap-[8px] cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-[14px]">{label}</span>
      </label>
    </div>
  );
};
