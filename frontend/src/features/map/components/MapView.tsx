import { useState, useEffect, useRef } from 'react';
import type { JSX } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import { useMapStore } from '../store';
import { PMTILES_SOURCES, LOCATION_CONFIG, MAP_DEFAULT_ORIENTATION } from '../config/mapConfig';
import { createMapLayers } from '../styles/layers';
import { useMapUpdates } from '../hooks/useMapUpdates';
import { useTerrainSetup } from '../hooks/useTerrainSetup';
import { useDeckGLLayers } from '../hooks/useDeckGLLayers'; 

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
          landuse_human: {
            type: 'vector',
            url: sources.landuse_human,
          },
          land_physical: {
            type: 'vector',
            url: sources.land_physical,
          },
        },
        layers: createMapLayers(),
      },
      center: locationConfig.center,
      zoom: locationConfig.zoom,
      pitch: MAP_DEFAULT_ORIENTATION.defaultPitch,
      bearing: MAP_DEFAULT_ORIENTATION.defaultBearing,
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
  useDeckGLLayers(map, mapLoaded);

  return <div ref={mapContainer} className="absolute top-0 left-0 w-full h-full" />;
};
