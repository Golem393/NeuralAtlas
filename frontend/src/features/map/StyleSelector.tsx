import { useState } from 'react';
import { useMapStore } from '@/stores/mapStore';
import {
  Map,
  Layers,
  Box,
  Sun,
  Moon,
  Minimize2,
  Maximize2,
  Circle,
  Palette,
  Droplet,
  Square,
} from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';

export const StyleSelector = () => {
  const {
    mapStyle,
    buildingStyle,
    buildingHeight,
    roadStyle,
    landuseStyle,
    setMapStyle,
    setBuildingStyle,
    setBuildingHeight,
    setRoadStyle,
    setLanduseStyle,
  } = useMapStore();

  const [expandedSections, setExpandedSections] = useState({
    buildings: false,
    roads: false,
    landuse: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
          Map Style
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <IconButton
            active={mapStyle === 'dark'}
            onClick={() => setMapStyle('dark')}
            icon={Moon}
            label="Dark"
          />
          <IconButton
            active={mapStyle === 'light'}
            onClick={() => setMapStyle('light')}
            icon={Sun}
            label="Light"
          />
        </div>
      </div>

      <CollapsibleSection
        title="Road Style"
        expanded={expandedSections.roads}
        onToggle={() => toggleSection('roads')}
      >
        <div className="grid grid-cols-3 gap-2">
          <IconButton
            active={roadStyle === 'default'}
            onClick={() => setRoadStyle('default')}
            icon={Circle}
            label="Default"
          />
          <IconButton
            active={roadStyle === 'minimal'}
            onClick={() => setRoadStyle('minimal')}
            icon={Minimize2}
            label="Minimal"
          />
          <IconButton
            active={roadStyle === 'prominent'}
            onClick={() => setRoadStyle('prominent')}
            icon={Maximize2}
            label="Bold"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Landuse Style"
        expanded={expandedSections.landuse}
        onToggle={() => toggleSection('landuse')}
      >
        <div className="grid grid-cols-3 gap-2">
          <IconButton
            active={landuseStyle === 'vibrant'}
            onClick={() => setLanduseStyle('vibrant')}
            icon={Palette}
            label="Vibrant"
          />
          <IconButton
            active={landuseStyle === 'subtle'}
            onClick={() => setLanduseStyle('subtle')}
            icon={Droplet}
            label="Subtle"
          />
          <IconButton
            active={landuseStyle === 'none'}
            onClick={() => setLanduseStyle('none')}
            icon={Square}
            label="None"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Building Style"
        expanded={expandedSections.buildings}
        onToggle={() => toggleSection('buildings')}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <IconButton
              active={buildingStyle === 'realistic'}
              onClick={() => setBuildingStyle('realistic')}
              icon={Box}
              label="3D"
            />
            <IconButton
              active={buildingStyle === 'flat'}
              onClick={() => setBuildingStyle('flat')}
              icon={Layers}
              label="Flat"
            />
            <IconButton
              active={buildingStyle === 'outlined'}
              onClick={() => setBuildingStyle('outlined')}
              icon={Map}
              label="Outline"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block px-1">
              Height: {buildingHeight.toFixed(1)}x
            </label>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.1}
              value={buildingHeight}
              onChange={(e) => setBuildingHeight(parseFloat(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};
