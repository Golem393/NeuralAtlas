interface ToggleProps {
  active: boolean;
}

export const Toggle = ({ active }: ToggleProps) => (
  <div
    className={`ml-auto w-8 h-4 rounded-full transition-colors ${
      active ? 'bg-primary-foreground/30' : 'bg-muted'
    }`}
  >
    <div
      className={`w-3 h-3 rounded-full bg-current transition-transform mt-0.5 ${
        active ? 'translate-x-4' : 'translate-x-0.5'
      }`}
    />
  </div>
);
