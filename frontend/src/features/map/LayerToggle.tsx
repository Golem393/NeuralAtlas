import { useMapStore } from '@/stores/mapStore';
import { LayerType } from './types';
import { Route, Building2, Trees, Mountain } from 'lucide-react';
import { Toggle } from '@/components/ui/Toggle';
import { cn } from '@/lib/utils';

const layers = [
  { id: LayerType.Roads, label: 'Roads', icon: Route },
  { id: LayerType.Buildings, label: 'Buildings', icon: Building2 },
  { id: LayerType.Landuse, label: 'Land Use', icon: Trees },
  { id: LayerType.Terrain, label: 'Terrain', icon: Mountain},
];

export const LayerToggle = () => {
  const { visibleLayers, toggleLayer } = useMapStore();

  return (
    <div>
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
        Layers
      </h3>
      <div className="flex flex-col gap-2">
        {layers.map(({ id, label, icon: Icon }) => {
          const isActive = visibleLayers[id];

          return (
            <button
              key={id}
              onClick={() => toggleLayer(id)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground glow-sm'
                  : 'bg-secondary/50 text-foreground hover:bg-secondary'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
              <Toggle active={isActive} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
