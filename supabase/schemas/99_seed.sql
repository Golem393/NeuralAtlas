-- 99_seed.sql
-- Sample data for development
-- Modify this file to add/change seed data

INSERT INTO buildings (name, address, building_type, height, num_floors, year_built, location) VALUES
    ('Sample Tower', '123 Main St', 'residential', 45.5, 15, 2010, ST_SetSRID(ST_MakePoint(11.5820, 48.1351), 4326)),
    ('Office Complex', '456 Business Ave', 'commercial', 60.0, 20, 2015, ST_SetSRID(ST_MakePoint(11.5830, 48.1360), 4326)),
    ('Historic Building', '789 Old Town', 'mixed_use', 25.0, 8, 1890, ST_SetSRID(ST_MakePoint(11.5810, 48.1340), 4326))
ON CONFLICT (id) DO NOTHING;
