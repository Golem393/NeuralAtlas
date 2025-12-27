import { useEffect, useState } from 'react';
import type { MutableRefObject } from 'react';
import type maplibregl from 'maplibre-gl';

const TERRAIN_SOURCE_ID = 'terrarium-terrain';

export const useTerrainSetup = (
  map: MutableRefObject<maplibregl.Map | null>,
  mapLoaded: boolean,
) => {
  const [terrainSourceLoaded, setTerrainSourceLoaded] = useState(false);
  
  // Reset terrain source loaded state when map is recreated
  useEffect(() => {
    if (!mapLoaded) {
      setTerrainSourceLoaded(false);
    }
  }, [mapLoaded]);
  
  useEffect(() => {
    if (!map.current || !mapLoaded) {
      return;
    }

    const sourceExists = map.current.getSource(TERRAIN_SOURCE_ID);

    if (!sourceExists) {
      map.current.addSource(TERRAIN_SOURCE_ID, {
        type: 'raster-dem',
        tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
        encoding: 'terrarium',
        tileSize: 256,
        maxzoom: 15,
      });
      setTerrainSourceLoaded(true);
    }
  }, [map, mapLoaded]);
  
  return terrainSourceLoaded;
};