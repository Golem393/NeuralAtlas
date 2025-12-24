import { useMutation } from '@tanstack/react-query';
import { configureTiles } from '@/api/endpoints/tiles';
import type { MapConfigRequest } from '@/types/mapConfig';

export const useMapConfiguration = () => {
  return useMutation({
    mutationFn: (config: MapConfigRequest) => configureTiles(config),
    onSuccess: (data) => {
      console.log('Tile configuration received:', data);
    },
  });
};