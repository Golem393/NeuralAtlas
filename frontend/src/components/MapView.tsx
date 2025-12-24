import { useEffect, useRef} from 'react';
import type { JSX } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapConfiguration } from '@/hooks/queries/useMapConfiguration';
import { useMapStore } from '@/stores/mapStore';

export const MapView = (): JSX.Element => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  
  const { selectedSource, layers, style, bbox } = useMapStore();
  const { mutate: configureMap, data: tileConfig } = useMapConfiguration();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {},
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': style.background_color
            }
          }
        ]
      },
      center: [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2],
      zoom: 12,
      pitch: 45,
      bearing: 0,
    });

    // CRITICAL: Cleanup to prevent WebGL crashes
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Fetch tile configuration when settings change
  useEffect(() => {
    configureMap({
      map_source: selectedSource,
      layers,
      style,
      bbox,
    });
  }, [selectedSource, layers, style, configureMap]);

  // Update map when tile config arrives
  useEffect(() => {
    if (!map.current || !tileConfig) return;

    const mapInstance = map.current;

    // Wait for map to load
    if (!mapInstance.loaded()) {
      mapInstance.once('load', () => updateMapLayers(mapInstance, tileConfig));
    } else {
      updateMapLayers(mapInstance, tileConfig);
    }
  }, [tileConfig]);

  const updateMapLayers = (
    mapInstance: maplibregl.Map,
    config: any
  ) => {
    // Remove existing layers (except background)
    const existingLayers = mapInstance.getStyle().layers || [];
    existingLayers.forEach((layer) => {
      if (layer.id !== 'background' && mapInstance.getLayer(layer.id)) {
        mapInstance.removeLayer(layer.id);
      }
    });

    // Remove existing sources
    Object.keys(mapInstance.getStyle().sources || {}).forEach((sourceId) => {
      if (mapInstance.getSource(sourceId)) {
        mapInstance.removeSource(sourceId);
      }
    });

    // Add new sources and layers from backend config
    const { sources, layers } = config.style_json;

    Object.entries(sources || {}).forEach(([id, source]) => {
      if (!mapInstance.getSource(id)) {
        mapInstance.addSource(id, source as maplibregl.SourceSpecification);
      }
    });

    (layers || []).forEach((layer: any) => {
      if (!mapInstance.getLayer(layer.id)) {
        mapInstance.addLayer(layer);
      }
    });

    // Update background color
    mapInstance.setPaintProperty(
      'background',
      'background-color',
      style.background_color
    );
  };

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      style={{ minHeight: '600px' }}
    />
  );
};