-- 10_ingestion_functions.sql
-- Helper functions for data ingestion from Python scripts

-- Function to insert building from WKT
CREATE OR REPLACE FUNCTION insert_building(
    p_id TEXT,
    p_source VARCHAR(50),
    p_building_class VARCHAR(50),
    p_geometry_wkt TEXT,
    p_height FLOAT,
    p_num_floors INTEGER
) RETURNS VOID AS $$
BEGIN
    INSERT INTO map_buildings (external_id, source, building_class, geometry, height, num_floors)
    VALUES (
        p_id,
        p_source,
        p_building_class,
        ST_GeomFromText(p_geometry_wkt, 4326),
        p_height,
        p_num_floors
    )
    ON CONFLICT (external_id) DO UPDATE
    SET
        building_class = EXCLUDED.building_class,
        geometry = EXCLUDED.geometry,
        height = EXCLUDED.height,
        num_floors = EXCLUDED.num_floors,
        created_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to insert road from WKT
CREATE OR REPLACE FUNCTION insert_road(
    p_id TEXT,
    p_source VARCHAR(50),
    p_road_class VARCHAR(50),
    p_surface VARCHAR(50),
    p_geometry_wkt TEXT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO map_roads (external_id, source, road_class, surface, geometry)
    VALUES (
        p_id,
        p_source,
        p_road_class,
        p_surface,
        ST_GeomFromText(p_geometry_wkt, 4326)
    )
    ON CONFLICT (external_id) DO UPDATE
    SET
        road_class = EXCLUDED.road_class,
        surface = EXCLUDED.surface,
        geometry = EXCLUDED.geometry,
        created_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to insert landuse from WKT
CREATE OR REPLACE FUNCTION insert_landuse(
    p_id TEXT,
    p_source VARCHAR(50),
    p_class VARCHAR(50),
    p_subtype VARCHAR(50),
    p_geometry_wkt TEXT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO map_landuse (external_id, source, class, subtype, geometry)
    VALUES (
        p_id,
        p_source,
        p_class,
        p_subtype,
        ST_GeomFromText(p_geometry_wkt, 4326)
    )
    ON CONFLICT (external_id) DO UPDATE
    SET
        class = EXCLUDED.class,
        subtype = EXCLUDED.subtype,
        geometry = EXCLUDED.geometry,
        created_at = NOW();
END;
$$ LANGUAGE plpgsql;
