from .base import MapLayer

class BuildingLayer(MapLayer):
    def get_source(self, base_url: str):
        return {
            "type": "vector",
            "url": f"{base_url}/map_buildings"
        }

    def get_layers(self, style_config):
        return [{
            "id": "buildings-3d",
            "type": "fill-extrusion",
            "source": "buildings",
            "source-layer": "map_buildings",
            "paint": {
                "fill-extrusion-color": style_config.building_color,
                "fill-extrusion-height": ["coalesce", ["get", "height"], 10],
                "fill-extrusion-base": 0,
                "fill-extrusion-opacity": 0.9
            }
        }]