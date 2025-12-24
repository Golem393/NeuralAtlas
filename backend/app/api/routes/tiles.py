from fastapi import APIRouter

from app.schemas.map_config import LayerType, MapConfigRequest, TileConfigResponse
from app.services.style_builder import StyleBuilder

router = APIRouter()


@router.post("/configure", response_model=TileConfigResponse)
async def configure_map(config: MapConfigRequest):
    base_url = "http://localhost:3001"  # martin server

    builder = StyleBuilder(base_url)
    style_json = builder.build(config)

    enabled_layers = []
    if config.layers.show_buildings:
        enabled_layers.append(LayerType.BUILDINGS)
    if config.layers.show_roads:
        enabled_layers.append(LayerType.ROADS)
    if config.layers.show_landuse:
        enabled_layers.append(LayerType.LANDUSE)

    return TileConfigResponse(
        tile_url=base_url, style_json=style_json, layers_enabled=enabled_layers
    )
