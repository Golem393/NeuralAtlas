import { useQuery} from '@tanstack/react-query';
import { getBuildings, getBuilding } from '../../api/endpoints/buildings';

export const useBuildings = () => {
  return useQuery({
    queryKey: ['buildings'],
    queryFn: getBuildings,
  });
};

export const useBuilding = (id: number) => {
  return useQuery({
    queryKey: ['buildings', id],
    queryFn: () => getBuilding(id),
    enabled: !!id,
  });
};
