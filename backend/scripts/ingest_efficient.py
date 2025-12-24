#!/usr/bin/env python3
"""
Efficient Overture ingestion using local extract.
First downloads Munich data, then queries it locally.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import duckdb
from app.database import supabase

MUNICH_BBOX = (11.4, 48.1, 11.7, 48.2)
EXTRACT_DIR = Path(__file__).parent / "overture_extracts"
EXTRACT_DIR.mkdir(exist_ok=True)


def download_munich_extract():
    """Download only Munich buildings to a local file."""
    print("📦 Downloading Munich building extract (one-time, ~2-5 min)...")
    
    conn = duckdb.connect(database=':memory:')
    conn.execute("INSTALL spatial; LOAD spatial;")
    conn.execute("INSTALL httpfs; LOAD httpfs;")
    conn.execute("SET s3_region='us-west-2';")
    
    # Download to local parquet
    local_file = EXTRACT_DIR / "munich_buildings.parquet"
    
    if local_file.exists():
        print(f"✅ Extract already exists: {local_file}")
        return local_file
    
    bbox = MUNICH_BBOX
    query = f"""
    COPY (
        SELECT 
            id,
            height,
            num_floors,
            class,
            geometry
        FROM read_parquet('s3://overturemaps-us-west-2/release/*/theme=buildings/type=building/*', 
                          filename=true, hive_partitioning=1)
        WHERE bbox.xmin BETWEEN {bbox[0]} AND {bbox[2]}
          AND bbox.ymin BETWEEN {bbox[1]} AND {bbox[3]}
    ) TO '{local_file}' (FORMAT PARQUET);
    """
    
    print("⏳ Downloading... (this will be slow once, but then fast forever)")
    conn.execute(query)
    conn.close()
    
    print(f"✅ Downloaded to {local_file}")
    return local_file


def ingest_from_local(limit=1000):
    """Ingest from local extract - FAST!"""
    local_file = EXTRACT_DIR / "munich_buildings.parquet"
    
    if not local_file.exists():
        print("❌ Local extract not found. Run with --download first")
        return
    
    print(f"🚀 Reading from local extract (FAST)...")
    
    conn = duckdb.connect(database=':memory:')
    conn.execute("INSTALL spatial; LOAD spatial;")
    
    query = f"""
    SELECT 
        id,
        height,
        num_floors,
        class as building_class,
        ST_AsText(geometry) as geometry_wkt
    FROM read_parquet('{local_file}')
    LIMIT {limit}
    """
    
    results = conn.execute(query).fetchall()
    print(f"✅ Found {len(results)} buildings")
    
    # Insert with progress
    for idx, row in enumerate(results, 1):
        building_id, height, num_floors, building_class, geom_wkt = row
        
        supabase.rpc('insert_building', {
            'p_id': building_id,
            'p_source': 'overture',
            'p_building_class': building_class,
            'p_geometry_wkt': geom_wkt,
            'p_height': float(height) if height else None,
            'p_num_floors': int(num_floors) if num_floors else None
        }).execute()
        
        if idx % 50 == 0:
            print(f"   📊 Inserted {idx}/{len(results)} buildings...")
    
    print(f"✅ Inserted {len(results)} buildings into database")
    conn.close()


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--download', action='store_true', 
                       help='Download Munich extract first (one-time, slow)')
    parser.add_argument('--limit', type=int, default=500,
                       help='Max buildings to insert (default: 500)')
    args = parser.parse_args()
    
    if args.download:
        download_munich_extract()
        print("\n✨ Extract ready! Now run WITHOUT --download flag to ingest quickly")
    else:
        ingest_from_local(args.limit)


if __name__ == '__main__':
    main()
