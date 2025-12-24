#!/usr/bin/env python3
"""Quick script to add test data without querying Overture."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import supabase
from app.config import settings

print("🚀 Adding test data to database...")
print(f"🔑 Using Supabase URL: {settings.SUPABASE_URL}")
print(f"🔑 Service key loaded: {bool(settings.SUPABASE_SERVICE_KEY and len(settings.SUPABASE_SERVICE_KEY) > 20)}")
print(f"🔑 Service key prefix: {settings.SUPABASE_SERVICE_KEY[:20] if settings.SUPABASE_SERVICE_KEY else 'MISSING'}...")

# Munich area test buildings
test_buildings = [
    ("test-bld-1", 11.55, 48.13, 15.0, 4),
    ("test-bld-2", 11.56, 48.14, 20.0, 5),
    ("test-bld-3", 11.54, 48.12, 12.0, 3),
    ("test-bld-4", 11.57, 48.15, 18.0, 6),
    ("test-bld-5", 11.53, 48.16, 25.0, 7),
]

for building_id, lon, lat, height, floors in test_buildings:
    # Create a small square building as MULTIPOLYGON
    wkt = f"MULTIPOLYGON((({lon} {lat}, {lon+0.001} {lat}, {lon+0.001} {lat+0.001}, {lon} {lat+0.001}, {lon} {lat})))"
    
    supabase.rpc('insert_building', {
        'p_id': building_id,
        'p_source': 'test',
        'p_building_class': 'residential',
        'p_geometry_wkt': wkt,
        'p_height': height,
        'p_num_floors': floors
    }).execute()
    print(f"  ✅ Added building {building_id}")

# Test roads
test_roads = [
    ("test-road-1", 11.52, 48.12, 11.58, 48.16, "primary"),
    ("test-road-2", 11.53, 48.11, 11.57, 48.15, "secondary"),
]

for road_id, lon1, lat1, lon2, lat2, road_class in test_roads:
    wkt = f"MULTILINESTRING(({lon1} {lat1}, {lon2} {lat2}))"
    
    supabase.rpc('insert_road', {
        'p_id': road_id,
        'p_source': 'test',
        'p_road_class': road_class,
        'p_surface': 'asphalt',
        'p_geometry_wkt': wkt
    }).execute()
    print(f"  ✅ Added road {road_id}")

# Test landuse (parks, forests, etc.)
test_landuse = [
    ("test-landuse-1", 11.545, 48.135, "park", "urban_park"),
    ("test-landuse-2", 11.555, 48.145, "forest", "natural"),
    ("test-landuse-3", 11.565, 48.125, "water", "lake"),
]

for landuse_id, lon, lat, land_class, subtype in test_landuse:
    # Create a polygon for landuse area
    wkt = f"MULTIPOLYGON((({lon} {lat}, {lon+0.002} {lat}, {lon+0.002} {lat+0.002}, {lon} {lat+0.002}, {lon} {lat})))"
    
    supabase.rpc('insert_landuse', {
        'p_id': landuse_id,
        'p_source': 'test',
        'p_class': land_class,
        'p_subtype': subtype,
        'p_geometry_wkt': wkt
    }).execute()
    print(f"  ✅ Added landuse {landuse_id}")

print("\n✨ Test data added! Refresh your map to see it.")
