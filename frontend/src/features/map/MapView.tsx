import { useEffect, useRef } from 'react';
import type { JSX } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import { useMapStore } from '@/stores/mapStore';
import { PMTILES_SOURCES } from '@/config/mapSources';
import { createMapLayers } from '@/styles/map';
import { MAP_CONFIG } from './types';
import { calculateCenter } from './utils/mapCalculations';
import { useMapUpdates } from './hooks/useMapUpdates';

export const MapView = (): JSX.Element => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const mapLoaded = useRef(false);
  const { bbox } = useMapStore();

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

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          buildings: {
            type: 'vector',
            url: PMTILES_SOURCES.buildings,
          },
          roads: {
            type: 'vector',
            url: PMTILES_SOURCES.roads,
          },
          landuse: {
            type: 'vector',
            url: PMTILES_SOURCES.landuse,
          },
        },
        layers: createMapLayers(),
      },
      center: calculateCenter(bbox),
      zoom: MAP_CONFIG.defaultZoom,
      pitch: MAP_CONFIG.defaultPitch,
      bearing: MAP_CONFIG.defaultBearing,
    });

    map.current.on('load', () => {
      mapLoaded.current = true;
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        mapLoaded.current = false;
      }
    };
  }, [bbox]);

  // Handle all map style updates
  useMapUpdates(map, mapLoaded);

  return <div ref={mapContainer} className="absolute top-0 left-0 w-full h-full" />;
};
