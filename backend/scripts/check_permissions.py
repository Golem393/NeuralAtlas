#!/usr/bin/env python3
"""Check database permissions and RLS status."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

# from app.database import supabase


print("🔍 Checking database permissions...\n")

# Check RLS status
rls_query = """
SELECT
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('map_buildings', 'map_roads', 'map_landuse');
"""

try:
    result = supabase.rpc("exec_sql", {"query": rls_query}).execute()
    print("📊 RLS Status:")
    print(result.data)
except Exception as e:
    print(f"❌ Could not check RLS status via RPC: {e}")
    print("\n💡 Trying direct query...")

# Try a simpler test - direct insert without function
print("\n🧪 Testing direct table access...")
try:
    result = supabase.table("map_buildings").select("*").limit(1).execute()
    print(f"✅ Can READ from map_buildings: {len(result.data)} rows")
except Exception as e:
    print(f"❌ Cannot READ from map_buildings: {e}")

try:
    # Try inserting a test record
    test_wkt = (
        "MULTIPOLYGON(((11.55 48.13, 11.551 48.13, 11.551 48.131, 11.55 48.131, 11.55 48.13)))"
    )
    result = supabase.rpc(
        "insert_building",
        {
            "p_id": "permission-test",
            "p_source": "test",
            "p_building_class": "test",
            "p_geometry_wkt": test_wkt,
            "p_height": 10.0,
            "p_num_floors": 2,
        },
    ).execute()
    print("✅ Can call insert_building function")
except Exception as e:
    print(f"❌ Cannot call insert_building: {e}")
