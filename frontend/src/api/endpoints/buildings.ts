import { fetchApi } from '../client';
import type { Building } from '../types';

export const getBuildings = async (): Promise<Building[]> => {
  return fetchApi<Building[]>('/api/buildings');
};

export const getBuilding = async (id: number): Promise<Building> => {
  return fetchApi<Building>(`/api/buildings/${id}`);
};
