import { useBuildings } from '../hooks/queries/useBuildings';
import type { Building } from '../api/types';

export default function BuildingsList() {
  const { data: buildings, isLoading, error } = useBuildings();

  if (isLoading) {
    return <div className="text-center py-8 text-gray-400">Loading buildings...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-400">Error loading buildings: {error.message}</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-left">Buildings from Supabase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buildings?.map((building: Building) => (
          <div
            key={building.id}
            className="bg-white/5 border border-white/10 rounded-lg p-6 text-left transition-all hover:-translate-y-1 hover:border-indigo-500/50"
          >
            <h3 className="mt-0 mb-4 text-indigo-400 text-xl font-semibold">{building.name || 'Unnamed Building'}</h3>
            <p className="mb-2 text-sm text-gray-300"><strong className="text-gray-400">Address:</strong> {building.address || 'N/A'}</p>
            <p className="mb-2 text-sm text-gray-300"><strong className="text-gray-400">Type:</strong> {building.building_type || 'N/A'}</p>
            <p className="mb-2 text-sm text-gray-300"><strong className="text-gray-400">Height:</strong> {building.height ? `${building.height}m` : 'N/A'}</p>
            <p className="mb-2 text-sm text-gray-300"><strong className="text-gray-400">Floors:</strong> {building.num_floors || 'N/A'}</p>
            <p className="mb-0 text-sm text-gray-300"><strong className="text-gray-400">Built:</strong> {building.year_built || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
