import { useState } from 'react';
import { useMapStore } from '../store';
import { MapStyle, BuildingStyle, RoadStyle, LanduseStyle } from '../types';
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
  Square
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
    terrainExaggeration,
    setMapStyle,
    setBuildingStyle,
    setBuildingHeight,
    setRoadStyle,
    setLanduseStyle,
    setTerrainExaggeration,
  } = useMapStore();

  const [expandedSections, setExpandedSections] = useState({
    buildings: false,
    roads: false,
    landuse: false,
    terrain : false,
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
            active={mapStyle === MapStyle.Dark}
            onClick={() => setMapStyle(MapStyle.Dark)}
            icon={Moon}
            label="Dark"
          />
          <IconButton
            active={mapStyle === MapStyle.Light}
            onClick={() => setMapStyle(MapStyle.Light)}
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
            active={roadStyle === RoadStyle.Default}
            onClick={() => setRoadStyle(RoadStyle.Default)}
            icon={Circle}
            label="Default"
          />
          <IconButton
            active={roadStyle === RoadStyle.Minimal}
            onClick={() => setRoadStyle(RoadStyle.Minimal)}
            icon={Minimize2}
            label="Minimal"
          />
          <IconButton
            active={roadStyle === RoadStyle.Prominent}
            onClick={() => setRoadStyle(RoadStyle.Prominent)}
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
            active={landuseStyle === LanduseStyle.Vibrant}
            onClick={() => setLanduseStyle(LanduseStyle.Vibrant)}
            icon={Palette}
            label="Vibrant"
          />
          <IconButton
            active={landuseStyle === LanduseStyle.Subtle}
            onClick={() => setLanduseStyle(LanduseStyle.Subtle)}
            icon={Droplet}
            label="Subtle"
          />
          <IconButton
            active={landuseStyle === LanduseStyle.None}
            onClick={() => setLanduseStyle(LanduseStyle.None)}
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
              active={buildingStyle === BuildingStyle.Realistic}
              onClick={() => setBuildingStyle(BuildingStyle.Realistic)}
              icon={Box}
              label="3D"
            />
            <IconButton
              active={buildingStyle === BuildingStyle.Flat}
              onClick={() => setBuildingStyle(BuildingStyle.Flat)}
              icon={Layers}
              label="Flat"
            />
            <IconButton
              active={buildingStyle === BuildingStyle.Outlined}
              onClick={() => setBuildingStyle(BuildingStyle.Outlined)}
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

      <CollapsibleSection
        title="Terrain"
        expanded={expandedSections.terrain}
        onToggle={() => toggleSection('terrain')}
        
      >
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block px-1">
            Exaggeration: {terrainExaggeration.toFixed(1)}x
          </label>
          <input
            type="range"
            min={0}
            max={3}
            step={0.1}
            value={terrainExaggeration}
            onChange={(e) => setTerrainExaggeration(parseFloat(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>
      </CollapsibleSection>
    </div>
  );
};
