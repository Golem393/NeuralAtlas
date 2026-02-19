#!/usr/bin/env python3
import subprocess
import json
from pathlib import Path

# Munich Bounding Box
BBOX = "11.36,48.06,11.72,48.25"
OUTPUT_DIR = Path(__file__).parent.parent.parent / "data" / "pmtiles"

def clean_landcover(input_path, output_path):
    print(f"🧹 Cleaning {input_path.name}...")
    
    kept_count = 0
    dropped_urban = 0
    dropped_detail = 0
    
    with open(input_path, 'r') as f_in, open(output_path, 'w') as f_out:
        for i, line in enumerate(f_in):
            try:
                feature = json.loads(line)
                props = feature.get('properties', {})
                
                # DEBUG: Print the first feature to verify structure
                if i == 0:
                    print(f"👀 First feature keys: {list(props.keys())}")
                    print(f"   Subtype: {props.get('subtype')}")
                    print(f"   Cartography: {props.get('cartography')}")

                # 1. FILTER: Drop Urban (City blocks)
                if props.get('subtype') == 'urban':
                    dropped_urban += 1
                    continue

                # 2. FILTER: Drop High Detail (Zoom 13+)
                # We relax the check: Keep Zoom 0-12. Drop 13, 14, 15.
                carto = props.get('cartography') or {}
                min_zoom = carto.get('min_zoom')
                
                # If min_zoom is missing (None), we KEEP it to be safe.
                # If min_zoom is > 12 (too detailed), we DROP it.
                if min_zoom is not None and min_zoom > 12:
                    dropped_detail += 1
                    continue

                # Write the valid line
                f_out.write(line)
                kept_count += 1
                
            except json.JSONDecodeError:
                continue

    print(f"📊 Stats: Kept {kept_count} | Dropped {dropped_urban} Urban | Dropped {dropped_detail} Detailed")
    
    if kept_count == 0:
        raise ValueError("❌ STOP: The filter removed EVERYTHING! Check the debug output above.")

def generate_layer(layer, theme):
    print(f"\n--- Processing {layer} ---")
    
    raw_file = OUTPUT_DIR / f"{layer}_raw.geojsonseq"
    clean_file = OUTPUT_DIR / f"{layer}_clean.geojsonseq"
    pmtiles_file = OUTPUT_DIR / f"munich_{layer}.pmtiles"

    # STEP 1: DOWNLOAD
    # We just grab everything. It's safe and simple.
    subprocess.run([
        "overturemaps", "download",
        "--bbox", BBOX,
        "-f", "geojsonseq",
        "--type", theme,
        "-o", str(raw_file)
    ], check=True)

    # STEP 2: CLEAN (Only needed for landcover)
    final_input = raw_file
    if layer == "landcover":
        clean_landcover(raw_file, clean_file)
        final_input = clean_file # Switch to using the clean file
        raw_file.unlink() # Delete the big raw file to save space

    # STEP 3: CONVERT
    # Now Tippecanoe will fly because the data is clean.
    tippecanoe_args = [
        "tippecanoe", "-o", str(pmtiles_file), "--force",
        "-P", "--drop-densest-as-needed", 
        "-l", layer,
        str(final_input)
    ]

    # Specific settings per layer
    if layer == "landcover":
        tippecanoe_args.extend([
            "-Z", "9", "-z", "12",
            "--simplification=10",
            "--coalesce"
            
            # Just drop metadata to save space
            "-x", "sources", "-x", "version", "-x", "update_time", "-x", "cartography", "-x", "subtype"
        ])
    else:
        tippecanoe_args.extend(["-Z", "10", "-z", "16"])

    subprocess.run(tippecanoe_args, check=True)
    
    # Cleanup
    if clean_file.exists(): clean_file.unlink()
    if raw_file.exists(): raw_file.unlink()
    print(f"✅ {layer} Done!")

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Process heavier layers first
    generate_layer("landcover", "land_cover")
    generate_layer("landuse", "land_use")
    generate_layer("buildings", "building")
    generate_layer("roads", "segment")

if __name__ == "__main__":
    main()