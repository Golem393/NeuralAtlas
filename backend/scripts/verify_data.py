#!/usr/bin/env python3
"""Verify test data exists in database."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import supabase

print("🔍 Checking database contents...\n")

# Check buildings
result = supabase.table("map_buildings").select("id, source, height, num_floors").execute()
print(f"📦 Buildings in database: {len(result.data)}")
for bld in result.data[:5]:
    print(f"  - {bld['id']}: {bld.get('height')}m, {bld.get('num_floors')} floors")

# Check roads
result = supabase.table("map_roads").select("id, source, road_class").execute()
print(f"\n🛣️  Roads in database: {len(result.data)}")
for road in result.data[:5]:
    print(f"  - {road['id']}: {road.get('road_class')}")

# Check if Martin can see the tables
print("\n📍 Tables Martin should serve:")
print("  - public.map_buildings (as geojson)")
print("  - public.map_roads (as geojson)")
