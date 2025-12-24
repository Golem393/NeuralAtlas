import { useMapStore } from '@/stores/mapStore';
import { Checkbox } from '@/components/ui/Checkbox';

const layers = [
  { id: 'buildings' as const, label: 'Buildings' },
  { id: 'roads' as const, label: 'Roads' },
  { id: 'landuse' as const, label: 'Land Use' },
];

export const LayerToggle = () => {
  const { visibleLayers, toggleLayer } = useMapStore();

  return (
    <div>
      <h3 className="mb-[10px] text-[14px]">Layers</h3>
      {layers.map((layer) => (
        <Checkbox
          key={layer.id}
          label={layer.label}
          checked={visibleLayers[layer.id]}
          onChange={() => toggleLayer(layer.id)}
        />
      ))}
    </div>
  );
};
