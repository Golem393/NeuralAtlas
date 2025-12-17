export interface Building {
  id: number;
  name: string | null;
  address: string | null;
  building_type: string | null;
  height: number | null;
  num_floors: number | null;
  year_built: number | null;
  created_at: string;
  updated_at: string;
}
