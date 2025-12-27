import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const CollapsibleSection = ({
  title,
  expanded,
  onToggle,
  children,
}: CollapsibleSectionProps) => (
  <div>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1 hover:text-foreground transition-colors"
    >
      {title}
      {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
    </button>
    {expanded && <div className="animate-fade-in">{children}</div>}
  </div>
);
