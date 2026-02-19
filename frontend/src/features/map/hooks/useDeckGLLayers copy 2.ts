import { useEffect, useMemo } from 'react';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import type { Map, MapSourceDataEvent } from 'maplibre-gl';
import { GeometrySampler } from '../lib/mapGeometry';
import { SAMPLER_PRESETS } from '../lib/mapGeometry/presets';
import { GLTFLoader } from '@loaders.gl/gltf';
import debounce from 'lodash.debounce';

export const useDeckGLLayers = (
  map: React.RefObject<Map | null>,
  mapLoaded: boolean,
) => {
  const overlay = useMemo(() => {
    return new MapboxOverlay({
      //interleaved: true, // Usually desired with Mapbox/MapLibre to verify depth testing
      layers: []
    });
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (!map.current.hasControl(overlay as any)) {
      map.current.addControl(overlay as any);
    }

    const updateTrees = () => {
      if (!map.current) return;

      const zoom = map.current.getZoom();
      if (zoom < 13) {
        overlay.setProps({ layers: [] });
        return;
      }

      const isSourceLoaded = map.current.isSourceLoaded('land_physical');
      const landPhysicalFeatures = map.current.querySourceFeatures('land_physical', {
        sourceLayer: 'land_physical'
      });

      if (!landPhysicalFeatures.length) {
        if (isSourceLoaded) {
          overlay.setProps({ layers: [] });
        }
      }
    
      const forestFeatures = landPhysicalFeatures.filter(feature => {
        const props = feature.properties;
        return props?.class === 'forest' || 
              props?.subclass === 'forest' || 
              props?.subclass === 'wood' ||
              props?.class === 'wood';
      });

      if (!forestFeatures.length) {
        overlay.setProps({ layers: [] });
        return;
      }

      const allTrees = forestFeatures.flatMap((feature, idx) => {
          const geom = feature.geometry as GeoJSON.Geometry;
          const rings: number[][][] = [];
          if (geom.type === 'Polygon') {
              rings.push(geom.coordinates[0]); 
          } else if (geom.type === 'MultiPolygon') {
              geom.coordinates.forEach(polygon => {
                  rings.push(polygon[0]);
              });
          }

          // Use feature ID or first coordinate as deterministic seed
          const featureId = feature.id || feature.properties?.id || idx;
          const seed = `forest-${featureId}`;
          const sampler = new GeometrySampler({ 
            ...SAMPLER_PRESETS.trees, 
            density: 100000, // Increased from 25
            seed 
          });

          const trees = rings.flatMap(ring => sampler.sampleInPolygon(ring));
          return trees;
      });

      if (allTrees.length === 0) {
        overlay.setProps({ layers: [] });
        return;
      }

      const trees3DLayer = new ScenegraphLayer({
        id: 'trees-3d',
        data: allTrees,
        scenegraph: '/models/tree_small.glb',
        loaders: [GLTFLoader],
        getPosition: (d: any) => d.position,
        getOrientation: [0, 0, 90],
        getScale: (d: any) => [d.scale * 10, d.scale * 10, d.scale * 10],
        sizeScale: 1,
        _lighting: 'pbr',
        pickable: true,
      });
      overlay.setProps({ layers: [trees3DLayer] });
    };

    const debouncedUpdate = debounce(updateTrees, 200, { 
      maxWait: 500  // wait 200ms after the last call, but at most 500ms
    });
    const onSourceData = (e: MapSourceDataEvent) => {
      // Only trigger if it's the relevant source and it finished loading
      if (e.sourceId === 'land_physical' && e.isSourceLoaded) {
        debouncedUpdate();
      }
    };
    map.current.on('sourcedata', onSourceData);
    map.current.on('moveend', debouncedUpdate);

    updateTrees();

    return () => {
      if (map.current) {
        map.current.off('sourcedata', onSourceData);
        map.current.off('moveend', debouncedUpdate);
      }
      debouncedUpdate.cancel();
      if (map.current?.hasControl(overlay as any)) {
        map.current.removeControl(overlay as any);
      }
    };
  }, [map, mapLoaded, overlay]);
};