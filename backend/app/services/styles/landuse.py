from .base import MapLayer

class LanduseLayer(MapLayer):
    def get_source(self, base_url: str):
        return {
            "type": "vector",
            "url": f"{base_url}/map_landuse"
        }

    def get_layers(self, style_config):
        return [
            {
                "id": "landuse-water",
                "type": "fill",
                "source": "landuse",
                "source-layer": "map_landuse",
                "filter": ["==", ["get", "class"], "water"],
                "paint": {
                    "fill-color": style_config.water_color,
                    "fill-opacity": 0.6
                }
            },
            {
                "id": "landuse-park",
                "type": "fill",
                "source": "landuse",
                "source-layer": "map_landuse",
                "filter": ["in", ["get", "class"], ["literal", ["park", "forest", "grass", "recreation_ground"]]],
                "paint": {
                    "fill-color": "#90c090",
                    "fill-opacity": 0.5
                }
            },
            {
                "id": "landuse-industrial",
                "type": "fill",
                "source": "landuse",
                "source-layer": "map_landuse",
                "filter": ["in", ["get", "class"], ["literal", ["industrial", "commercial", "retail"]]],
                "paint": {
                    "fill-color": "#e0d0c0",
                    "fill-opacity": 0.4
                }
            },
            {
                "id": "landuse-residential",
                "type": "fill",
                "source": "landuse",
                "source-layer": "map_landuse",
                "filter": ["==", ["get", "class"], "residential"],
                "paint": {
                    "fill-color": "#f0e8e0",
                    "fill-opacity": 0.3
                }
            }
        ]
