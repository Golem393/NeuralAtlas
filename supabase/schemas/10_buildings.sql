-- 10_buildings.sql
-- Buildings table with PostGIS geometry
-- This is the source of truth - modify this file directly, don't create migrations manually

CREATE TABLE IF NOT EXISTS buildings (
    id BIGSERIAL PRIMARY KEY,
    name TEXT,
    address TEXT,
    building_type TEXT,
    height REAL,
    num_floors INTEGER,
    year_built INTEGER,
    -- Geometry column (point for now, can be polygon later)
    location GEOMETRY(POINT, 4326),
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create spatial index for fast queries
CREATE INDEX IF NOT EXISTS buildings_location_idx
    ON buildings USING GIST (location);

-- Create index on building type for filtering
CREATE INDEX IF NOT EXISTS buildings_type_idx
    ON buildings (building_type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_buildings_updated_at ON buildings;
CREATE TRIGGER update_buildings_updated_at
    BEFORE UPDATE ON buildings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
