from fastapi import APIRouter, Query
from titiler.core.factory import TilerFactory
from rio_tiler.io import COGReader

router = APIRouter()

# Create TiTiler COG endpoint factory
# This auto-generates tile endpoints for Cloud Optimized GeoTIFFs
cog = TilerFactory(
    router=router,
    path_dependency=lambda: None,  # No auth for now
)


@router.get("/sources")
async def get_terrain_sources():
    """
    Return available terrain data sources (COG URLs).
    These are Cloud Optimized GeoTIFFs that TiTiler can serve.
    """
    return {
        "sources": [
            {
                "id": "aws-terrain",
                "name": "AWS Terrain Tiles (Global)",
                "description": "SRTM-based elevation data",
                "cog_url": "s3://elevation-tiles-prod/skadi/{z}/{x}/{y}.tif",
                "format": "cog",
                "resolution": "30m",
                "coverage": "global"
            },
            {
                "id": "cop-dem-30",
                "name": "Copernicus DEM 30m",
                "description": "High-quality global elevation",
                "cog_url": "https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_N48_00_E011_00_DEM/Copernicus_DSM_COG_10_N48_00_E011_00_DEM.tif",
                "format": "cog",
                "resolution": "30m",
                "coverage": "global",
                "recommended": True
            }
        ]
    }


@router.get("/style")
async def get_terrain_style(
    cog_url: str = Query(..., description="URL to the COG terrain file"),
    colormap: str = Query("terrain", description="Colormap name (terrain, viridis, dem)"),
    hillshade: bool = Query(True, description="Apply hillshade effect")
):
    """
    Generate MapLibre style for terrain visualization.
    Uses TiTiler's dynamic tile generation.
    """
    # Base URL for TiTiler tiles - we'll use the /cog/tiles endpoint
    tile_url = f"http://localhost:8000/api/terrain/cog/tiles/{{z}}/{{x}}/{{y}}?url={cog_url}&rescale=0,3000&colormap_name={colormap}"
    
    return {
        "source": {
            "type": "raster-dem",
            "tiles": [tile_url],
            "tileSize": 256,
            "encoding": "terrarium",
            "maxzoom": 15
        },
        "layers": [
            {
                "id": "terrain-raster",
                "type": "raster",
                "source": "terrain",
                "paint": {
                    "raster-opacity": 0.7
                }
            }
        ] + ([{
            "id": "hillshade",
            "type": "hillshade",
            "source": "terrain",
            "paint": {
                "hillshade-exaggeration": 0.8,
                "hillshade-shadow-color": "#000000",
                "hillshade-illumination-direction": 315,
                "hillshade-accent-color": "#ffffff"
            }
        }] if hillshade else []),
        "terrain_3d": {
            "source": "terrain",
            "exaggeration": 1.5
        }
    }


@router.get("/preview")
async def preview_terrain(
    cog_url: str = Query(..., description="COG URL to preview"),
):
    """
    Get metadata and preview info for a terrain COG.
    Useful for debugging and showing data coverage.
    """
    try:
        with COGReader(cog_url) as cog:
            return {
                "bounds": cog.bounds,
                "center": [(cog.bounds[0] + cog.bounds[2]) / 2, (cog.bounds[1] + cog.bounds[3]) / 2],
                "minzoom": cog.minzoom,
                "maxzoom": cog.maxzoom,
                "band_count": len(cog.band_names),
                "dtype": str(cog.dataset.dtypes[0]),
                "colorinterp": [c.name for c in cog.dataset.colorinterp],
            }
    except Exception as e:
        return {"error": str(e)}