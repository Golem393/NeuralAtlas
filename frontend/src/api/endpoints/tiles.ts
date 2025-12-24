import { api } from '@/api/client';
import type { MapConfigRequest, TileConfigResponse } from '@/types/mapConfig';

export const configureTiles = async (
  config: MapConfigRequest
): Promise<TileConfigResponse> => {
  return api.post<TileConfigResponse>('/api/tiles/configure', config);
};