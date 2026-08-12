#!/usr/bin/env python3
"""
Pure Overture Maps Generator for munich
Downloads forests (wood/landuse) + mountain rocks without using heavy satellite data.
Fixed for latest overturemaps CLI (no --theme flag).
"""

import subprocess
import shutil
import sys
from pathlib import Path

# munich area [west, south, east, north]
munich_BBOX = "11.36,48.06,11.72,48.25"
OUTPUT_DIR = Path(__file__).parent.parent.parent / "data" / "pmtiles"

def check_dependencies():
    """Ensure tools are installed"""
    if not shutil.which("overturemaps"):
        print("❌ Missing 'overturemaps'. Run: pip install overturemaps")
        sys.exit(1)
    if not shutil.which("tippecanoe"):
        print("❌ Missing 'tippecanoe'. Install via brew/apt.")
        sys.exit(1)

def generate_layer(name: str, type_arg: str, min_z=10, max_z=15):
    """
    Download from Overture and convert to PMTiles
    """
    print(f"\n🏔️  Processing: {name.upper()}")
    
    geojson_file = OUTPUT_DIR / f"munich_{name}.geojson"
    pmtiles_file = OUTPUT_DIR / f"munich_{name}.pmtiles"
    
    # 1. Download
    cmd_dl = [
        "overturemaps", "download",
        "--bbox", munich_BBOX,
        "-f", "geojsonseq",
        "--type", type_arg,
        "-o", str(geojson_file)
    ]
    
    try:
        print(f"   ⬇️  Downloading type='{type_arg}'...")
        subprocess.run(cmd_dl, check=True)
    except subprocess.CalledProcessError:
        print(f"   ❌ Download failed for {name}")
        return

    # 2. Convert to PMTiles
    cmd_tile = [
        "tippecanoe",
        "-o", str(pmtiles_file),
        "--force",
        "--maximum-tile-bytes=1500000",
        "--maximum-tile-features=300000",
        "-P",
        #"--drop-densest-as-needed",
        "-l", name,           # Layer name inside the vector tile
        #"-x", "sources",      # Remove metadata to save space
        #"-x", "version",
        #"-x", "update_time",
        #"-x", "confidence",
        str(geojson_file)
    ]
    # "-Z", str(min_z),
    # "-z", str(max_z),


    try:
        print(f"   📦 Tiling {name}...")
        subprocess.run(cmd_tile, check=True)
        print(f"   ✅ Created {pmtiles_file.name}")
    except subprocess.CalledProcessError:
        print(f"   ❌ Tiling failed for {name}")
    
    # Cleanup
    if geojson_file.exists():
        geojson_file.unlink()

def main():
    print("🚀 Starting Pure Overture Export...")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    check_dependencies()

    # 1. Buildings
    generate_layer("buildings", "building", min_z=11, max_z=15)

    # 2. Roads
    generate_layer("roads", "segment", min_z=9, max_z=15)

    # 3. Human Land Use (Parks, Residential, Managed Forests)
    generate_layer("landuse_human", "land_use", min_z=8, max_z=14)

    # 4. Physical Land (Natural Wood, Scrub, Bare Rock, Scree)
    generate_layer("land_physical", "land", min_z=8, max_z=14)

    print(f"\n🎉 Done! Files are in {OUTPUT_DIR}")

if __name__ == "__main__":
    main()