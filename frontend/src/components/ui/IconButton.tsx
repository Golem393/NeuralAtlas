interface IconButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export const IconButton = ({ active, onClick, icon: Icon, label }: IconButtonProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
      active
        ? 'bg-primary text-primary-foreground glow-sm'
        : 'bg-secondary/50 text-foreground hover:bg-secondary'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-xs font-medium">{label}</span>
  </button>
);
