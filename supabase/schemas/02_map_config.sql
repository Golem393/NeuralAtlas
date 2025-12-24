-- Buildings
CREATE TABLE IF NOT EXISTS map_buildings (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_id TEXT UNIQUE NOT NULL, -- Overture GERS id
    source VARCHAR(50) NOT NULL,
    building_class VARCHAR(50), 
    geometry GEOMETRY(MULTIPOLYGON, 4326) NOT NULL,
    height FLOAT,
    num_floors INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roads
CREATE TABLE IF NOT EXISTS map_roads (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_id TEXT UNIQUE NOT NULL,
    source VARCHAR(50) NOT NULL,
    geometry GEOMETRY(MULTILINESTRING, 4326) NOT NULL,
    road_class VARCHAR(50),
    surface VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Landuse
CREATE TABLE IF NOT EXISTS map_landuse (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_id TEXT UNIQUE NOT NULL,
    source VARCHAR(50) NOT NULL,
    geometry GEOMETRY(MULTIPOLYGON, 4326) NOT NULL,
    class VARCHAR(50),
    subtype VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Efficiency: Spatial Indexing
CREATE INDEX IF NOT EXISTS idx_buildings_geom ON map_buildings USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_roads_geom ON map_roads USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_landuse_geom ON map_landuse USING GIST (geometry);


-- RLS Policies: Disable RLS for map data tables (backend-controlled, public read)
ALTER TABLE map_buildings DISABLE ROW LEVEL SECURITY;
ALTER TABLE map_roads DISABLE ROW LEVEL SECURITY;
ALTER TABLE map_landuse DISABLE ROW LEVEL SECURITY;

-- Permissions: Grant access for public read and backend write
-- anon: Frontend read access (via Martin/TiTiler)
-- service_role: Backend write access (Python scripts)
GRANT ALL ON map_buildings TO service_role;
GRANT SELECT ON map_buildings TO anon;
GRANT ALL ON map_roads TO service_role;
GRANT SELECT ON map_roads TO anon;
GRANT ALL ON map_landuse TO service_role;
GRANT SELECT ON map_landuse TO anon;
GRANT USAGE ON SCHEMA public TO anon, service_role;


-- User preferences
CREATE TABLE IF NOT EXISTS user_map_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    preferred_source VARCHAR(50) DEFAULT 'overture',
    layer_config JSONB DEFAULT '{"show_buildings": true, "show_roads": true, "show_water": true, "show_terrain": false}'::jsonb,
    style_config JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);