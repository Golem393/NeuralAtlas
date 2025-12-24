from pydantic import BaseModel
from enum import Enum

class MapSource(str, Enum):
    OVERTURE = "overture"
    OSM = "osm"

class LayerType(str, Enum):
    BUILDINGS = "buildings"
    ROADS = "roads"
    LANDUSE = "landuse"

class MapStyleConfig(BaseModel):
    background_color: str = "#f0f0f0"
    building_color: str = "#cccccc"
    road_color: str = "#ffffff"
    water_color: str = "#a0c8f0"

class LayerConfig(BaseModel):
    show_buildings: bool = True
    show_roads: bool = True
    show_landuse: bool = False

class MapConfigRequest(BaseModel):
    map_source: MapSource
    layers: LayerConfig
    style: MapStyleConfig
    bbox: tuple[float, float, float, float]  # [min_lon, min_lat, max_lon, max_lat]

class TileConfigResponse(BaseModel):
    tile_url: str
    style_json: dict
    layers_enabled: list[LayerType]