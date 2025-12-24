#!/usr/bin/env python3
"""
Ingest Overture Maps data into PostGIS database.
Usage: python ingest_overture.py --bbox 11.4,48.1,11.7,48.2 --limit 1000
"""

import argparse
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

import duckdb

from app.database import supabase


def ingest_buildings(bbox: tuple[float, float, float, float], limit: int = 1000):
    """Fetch buildings from Overture Maps and insert into PostGIS."""
    print(f"🏗️  Fetching buildings for bbox {bbox}...")
    print("⏳ This may take 1-2 minutes - scanning S3 Parquet files...")

    conn = duckdb.connect(database=":memory:")
    conn.execute("INSTALL spatial; LOAD spatial;")
    conn.execute("INSTALL httpfs; LOAD httpfs;")
    conn.execute("SET s3_region='us-west-2';")

    # Optimized query with better filtering
    query = f"""
    SELECT
        id,
        height,
        num_floors,
        class as building_class,
        ST_AsText(geometry) as geometry_wkt
    FROM read_parquet('s3://overturemaps-us-west-2/release/*/theme=buildings/type=building/*',
                      filename=true, hive_partitioning=1)
    WHERE bbox.xmin BETWEEN {bbox[0]} AND {bbox[2]}
      AND bbox.ymin BETWEEN {bbox[1]} AND {bbox[3]}
    LIMIT {limit}
    """

    print("🔍 Executing DuckDB query...")
    try:
        results = conn.execute(query).fetchall()
        print(f"✅ Found {len(results)} buildings")

        # Insert into Supabase with progress
        for idx, row in enumerate(results, 1):
            building_id, height, num_floors, building_class, geom_wkt = row

            # Use Supabase RPC to insert with PostGIS
            supabase.rpc(
                "insert_building",
                {
                    "p_id": building_id,
                    "p_source": "overture",
                    "p_building_class": building_class,
                    "p_geometry_wkt": geom_wkt,
                    "p_height": float(height) if height else None,
                    "p_num_floors": int(num_floors) if num_floors else None,
                },
            ).execute()

            # Progress update every 10 buildings
            if idx % 10 == 0:
                print(f"   📊 Inserted {idx}/{len(results)} buildings...")

        print(f"✅ Inserted {len(results)} buildings into database")
    except Exception as e:
        print(f"❌ Error fetching buildings: {e}")
    finally:
        conn.close()


def ingest_roads(bbox: tuple[float, float, float, float], limit: int = 1000):
    """Fetch roads from Overture Maps and insert into PostGIS."""
    print(f"🛣️  Fetching roads for bbox {bbox}...")

    conn = duckdb.connect(database=":memory:")
    conn.execute("INSTALL spatial; LOAD spatial;")
    conn.execute("INSTALL httpfs; LOAD httpfs;")
    conn.execute("SET s3_region='us-west-2';")

    query = f"""
    SELECT
        id,
        class as road_class,
        surface,
        ST_AsText(geometry) as geometry_wkt
    FROM read_parquet('s3://overturemaps-us-west-2/release/*/theme=transportation/type=segment/*',
                      hive_partitioning=1)
    WHERE bbox.xmin >= {bbox[0]} AND bbox.xmax <= {bbox[2]}
      AND bbox.ymin >= {bbox[1]} AND bbox.ymax <= {bbox[3]}
    LIMIT {limit}
    """

    try:
        results = conn.execute(query).fetchall()
        print(f"✅ Found {len(results)} roads")

        for idx, row in enumerate(results, 1):
            road_id, road_class, surface, geom_wkt = row

            supabase.rpc(
                "insert_road",
                {
                    "p_id": road_id,
                    "p_source": "overture",
                    "p_road_class": road_class,
                    "p_surface": surface,
                    "p_geometry_wkt": geom_wkt,
                },
            ).execute()

            if idx % 10 == 0:
                print(f"   📊 Inserted {idx}/{len(results)} roads...")

        print(f"✅ Inserted {len(results)} roads into database")
    except Exception as e:
        print(f"❌ Error fetching roads: {e}")
    finally:
        conn.close()


def ingest_landuse(bbox: tuple[float, float, float, float], limit: int = 500):
    """Fetch landuse from Overture Maps and insert into PostGIS."""
    print(f"🌳 Fetching landuse for bbox {bbox}...")

    conn = duckdb.connect(database=":memory:")
    conn.execute("INSTALL spatial; LOAD spatial;")
    conn.execute("INSTALL httpfs; LOAD httpfs;")
    conn.execute("SET s3_region='us-west-2';")

    query = f"""
    SELECT
        id,
        class,
        subtype,
        ST_AsText(geometry) as geometry_wkt
    FROM read_parquet('s3://overturemaps-us-west-2/release/*/theme=base/type=land/*',
                      hive_partitioning=1)
    WHERE bbox.xmin >= {bbox[0]} AND bbox.xmax <= {bbox[2]}
      AND bbox.ymin >= {bbox[1]} AND bbox.ymax <= {bbox[3]}
    LIMIT {limit}
    """

    try:
        results = conn.execute(query).fetchall()
        print(f"✅ Found {len(results)} landuse features")

        for idx, row in enumerate(results, 1):
            landuse_id, class_name, subtype, geom_wkt = row

            supabase.rpc(
                "insert_landuse",
                {
                    "p_id": landuse_id,
                    "p_source": "overture",
                    "p_class": class_name,
                    "p_subtype": subtype,
                    "p_geometry_wkt": geom_wkt,
                },
            ).execute()

            if idx % 10 == 0:
                print(f"   📊 Inserted {idx}/{len(results)} landuse features...")

        print(f"✅ Inserted {len(results)} landuse features into database")
    except Exception as e:
        print(f"❌ Error fetching landuse: {e}")
    finally:
        conn.close()


def main():
    parser = argparse.ArgumentParser(description="Ingest Overture Maps data")
    parser.add_argument(
        "--bbox",
        type=str,
        default="11.4,48.1,11.7,48.2",
        help="Bounding box as min_lon,min_lat,max_lon,max_lat (default: Munich area)",
    )
    parser.add_argument(
        "--limit", type=int, default=1000, help="Max features per layer (default: 1000)"
    )
    parser.add_argument(
        "--layers",
        type=str,
        default="buildings,roads,landuse",
        help="Comma-separated layers to ingest (default: buildings,roads,landuse)",
    )

    args = parser.parse_args()

    # Parse bbox
    bbox_parts = [float(x.strip()) for x in args.bbox.split(",")]
    if len(bbox_parts) != 4:
        print("❌ Invalid bbox format. Use: min_lon,min_lat,max_lon,max_lat")
        sys.exit(1)
    bbox = tuple(bbox_parts)

    layers = [l.strip() for l in args.layers.split(",")]

    print("\n🚀 Starting Overture Maps ingestion")
    print(f"📍 Bounding box: {bbox}")
    print(f"📊 Layers: {', '.join(layers)}")
    print(f"🔢 Limit per layer: {args.limit}\n")

    if "buildings" in layers:
        ingest_buildings(bbox, args.limit)

    if "roads" in layers:
        ingest_roads(bbox, args.limit)

    if "landuse" in layers:
        ingest_landuse(bbox, args.limit)

    print("\n✨ Ingestion complete!")


if __name__ == "__main__":
    main()
