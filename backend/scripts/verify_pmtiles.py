#!/usr/bin/env python3
"""
PMTiles Verifier for Dolomites
Checks if PMTiles are valid, contain layers, and have actual data at the BBox center.
"""

import math
import sys
from pathlib import Path
import json

try:
    from pmtiles.reader import Reader, MmapSource
except ImportError:
    print("❌ Missing 'pmtiles' library. Run: pip install pmtiles")
    sys.exit(1)

# Config matches your generator
DOLOMITES_CENTER = (46.54, 12.15)  # lat, lon (Cortina d'Ampezzo)
OUTPUT_DIR = Path(__file__).parent.parent.parent / "data" / "pmtiles"

FILES_TO_CHECK = [
    "dolomites_buildings.pmtiles",
    "dolomites_roads.pmtiles",
    "dolomites_landuse_human.pmtiles",
    "dolomites_land_physical.pmtiles"
]

def deg2num(lat_deg, lon_deg, zoom):
    """Converts lat/lon to generic Tile X/Y."""
    lat_rad = math.radians(lat_deg)
    n = 2.0 ** zoom
    xtile = int((lon_deg + 180.0) / 360.0 * n)
    ytile = int((1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n)
    return xtile, ytile

def check_pmtile(filename):
    filepath = OUTPUT_DIR / filename
    print(f"\n🔍 Inspecting: {filename}")
    
    if not filepath.exists():
        print(f"  ❌ File not found at {filepath}")
        return

    # check file size
    size_mb = filepath.stat().st_size / (1024 * 1024)
    print(f"  📂 Size: {size_mb:.2f} MB")
    
    if size_mb < 0.05:
        print("  ⚠️  WARNING: File is extremely small. Likely empty.")

    try:
        with open(filepath, "rb") as f:
            source = MmapSource(f)
            reader = Reader(source)
            header = reader.header()
            metadata = reader.metadata()
            
            # 1. Header Checks
            print(f"  📐 Zoom Levels: z{header['min_zoom']} - z{header['max_zoom']}")
            #print(f"  🌍 Bounds: {header['minLon']:.2f}, {header['minLat']:.2f} -> {header['maxLon']:.2f}, {header['maxLat']:.2f}")

            # 2. Metadata Checks (Layer names)
            # Tippecanoe usually puts vector_layers in json metadata
            layers = metadata.get('vector_layers', [])
            if layers:
                names = [l['id'] for l in layers]
                print(f"  🥞 Layers found: {', '.join(names)}")
            else:
                print("  ⚠️  No 'vector_layers' metadata found (could be raw or missing info).")

            # 3. Data Sampling Check (The Real Test)
            # We pick a zoom level right in the middle of the file's range
            test_z = max(header['min_zoom'], min(12, header['max_zoom']))
            tx, ty = deg2num(DOLOMITES_CENTER[0], DOLOMITES_CENTER[1], test_z)
            
            # Fetch tile
            try:
                tile_data = reader.get(test_z, tx, ty)
                if tile_data:
                    print(f"  ✅ DATA VERIFIED: Tile fetched at z{test_z}/{tx}/{ty} ({len(tile_data)} bytes)")
                else:
                    print(f"  ❌ NO DATA: Tile at Cortina center (z{test_z}/{tx}/{ty}) is empty/missing.")
                    print("     (This might be normal if the area is pure wilderness and this is the buildings layer)")
            except Exception as e:
                print(f"  ❌ Error fetching tile: {e}")

    except Exception as e:
        print(f"  ❌ INVALID PMTILES: {e}")

def main():
    print(f"🚀 Checking PMTiles in: {OUTPUT_DIR.resolve()}")
    if not OUTPUT_DIR.exists():
        print("❌ Directory does not exist.")
        sys.exit(1)

    for f in FILES_TO_CHECK:
        check_pmtile(f)
        
    print("\n🏁 Verification Complete.")

if __name__ == "__main__":
    main()