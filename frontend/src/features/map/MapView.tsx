import { useState, useEffect, useRef } from 'react';
import type { JSX } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import { useMapStore } from '@/stores/mapStore';
import { PMTILES_SOURCES, LOCATION_CONFIG } from '@/config/mapSources';
import { createMapLayers } from '@/styles/map';
import { MAP_CONFIG } from './types';
import { useMapUpdates } from './hooks/useMapUpdates';
import { useTerrainSetup } from './hooks/useTerrainSetup'; 

export const MapView = (): JSX.Element => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { location } = useMapStore();

  // Register PMTiles protocol once
  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol('pmtiles', protocol.tile);

    return () => {
      maplibregl.removeProtocol('pmtiles');
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const locationConfig = LOCATION_CONFIG[location];
    const sources = PMTILES_SOURCES[location];

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          buildings: {
            type: 'vector',
            url: sources.buildings,
          },
          roads: {
            type: 'vector',
            url: sources.roads,
          },
          landuse: {
            type: 'vector',
            url: sources.landuse,
          },
        },
        layers: createMapLayers(),
      },
      center: locationConfig.center,
      zoom: locationConfig.zoom,
      pitch: MAP_CONFIG.defaultPitch,
      bearing: MAP_CONFIG.defaultBearing,
    });

    map.current.on('load', () => {
      console.log('Map load event fired!');
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setMapLoaded(false);
      }
    };
  }, [location]);

  // Handle all map style updates
  const terrainSourceLoaded = useTerrainSetup(map, mapLoaded);
  useMapUpdates(map, mapLoaded, terrainSourceLoaded);

  return <div ref={mapContainer} className="absolute top-0 left-0 w-full h-full" />;
};
