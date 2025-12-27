#!/usr/bin/env python3
"""
Fast PMTiles generation script using overturemaps CLI
Generates buildings, roads, and landuse layers for Dolomites region (test terrain)
"""

import subprocess
import os
from pathlib import Path

# Dolomites - Cortina d'Ampezzo area [west, south, east, north]
DOLOMITES_BBOX = "12.10,46.50,12.20,46.58"
OUTPUT_DIR = Path(__file__).parent.parent.parent / "data" / "pmtiles"

def run_command(cmd: list[str], description: str):
    """Run a shell command with progress output"""
    print(f"\n🚀 {description}...")
    try:
        subprocess.run(cmd, check=True)
        print(f"✅ {description} completed")
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        raise

def generate_layer(layer_type: str, theme: str, region_name: str):
    """Generate PMTiles for a specific Overture layer"""
    print(f"\n{'='*60}")
    print(f"Processing {layer_type.upper()} layer")
    print(f"{'='*60}")
    
    geojson_file = OUTPUT_DIR / f"{region_name}_{layer_type}.geojson"
    pmtiles_file = OUTPUT_DIR / f"{region_name}_{layer_type}.pmtiles"
    
    # Step 1: Download from Overture using overturemaps CLI
    run_command(
        [
            "overturemaps",
            "download",
            "--bbox", DOLOMITES_BBOX,
            "-f", "geojson",
            "--type", theme,
            "-o", str(geojson_file)
        ],
        f"Downloading {layer_type} from Overture Maps"
    )
    
    # Step 2: Convert to PMTiles using tippecanoe
    tippecanoe_args = [
        "tippecanoe",
        "-o", str(pmtiles_file),
        "-Z", "10",  # Min zoom
        "-z", "16",  # Max zoom (higher for terrain detail)
        "-l", layer_type,
        "--drop-densest-as-needed",
        "--force",
        str(geojson_file)
    ]
    
    run_command(tippecanoe_args, f"Generating PMTiles for {layer_type}")
    
    # Clean up GeoJSON to save space
    print(f"🗑️  Removing temporary GeoJSON file...")
    geojson_file.unlink()
    
    print(f"✅ {layer_type} PMTiles ready: {pmtiles_file}")

def main():
    region_name = "dolomites"
    
    print("🏔️  NeuralAtlas PMTiles Generator - Dolomites Edition")
    print(f"📍 Region: Cortina d'Ampezzo, Dolomites ({DOLOMITES_BBOX})")
    print(f"📂 Output: {OUTPUT_DIR}")
    
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Generate each layer
    layers = [
        ("buildings", "building"),
        ("roads", "segment"),
        ("landuse", "land_use")
    ]
    
    for layer_name, theme in layers:
        try:
            generate_layer(layer_name, theme, region_name)
        except Exception as e:
            print(f"⚠️  Failed to generate {layer_name}: {e}")
            continue
    
    print("\n" + "="*60)
    print("🎉 All layers generated successfully!")
    print("="*60)
    print(f"\nGenerated files in {OUTPUT_DIR}:")
    for file in OUTPUT_DIR.glob(f"{region_name}_*.pmtiles"):
        size_mb = file.stat().st_size / (1024 * 1024)
        print(f"  - {file.name} ({size_mb:.2f} MB)")
    
    print("\n📝 Next steps:")
    print("  1. Move PMTiles files to frontend/public/data/")
    print("  2. Update frontend/src/config/mapSources.ts:")
    print(f"     - buildings: 'pmtiles://{region_name}_buildings.pmtiles'")
    print(f"     - roads: 'pmtiles://{region_name}_roads.pmtiles'")
    print(f"     - landuse: 'pmtiles://{region_name}_landuse.pmtiles'")
    print("  3. Update bbox in mapStore.ts to match Dolomites:")
    print(f"     bbox: [{DOLOMITES_BBOX}]")
    print("  4. Run: npm run dev")

if __name__ == "__main__":
    main()