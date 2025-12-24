from .base import MapLayer


class RoadLayer(MapLayer):
    def get_source(self, base_url: str):
        return {"type": "vector", "url": f"{base_url}/map_roads"}

    def get_layers(self, style_config):
        return [
            {
                "id": "roads-highway",
                "type": "line",
                "source": "roads",
                "source-layer": "map_roads",
                "filter": ["in", ["get", "road_class"], ["literal", ["motorway", "trunk"]]],
                "paint": {
                    "line-color": style_config.road_color,
                    "line-width": [
                        "interpolate",
                        ["exponential", 1.5],
                        ["zoom"],
                        8,
                        1,
                        14,
                        6,
                        18,
                        20,
                    ],
                    "line-opacity": 0.9,
                },
                "layout": {"line-cap": "round", "line-join": "round"},
            },
            {
                "id": "roads-major",
                "type": "line",
                "source": "roads",
                "source-layer": "map_roads",
                "filter": ["in", ["get", "road_class"], ["literal", ["primary", "secondary"]]],
                "paint": {
                    "line-color": style_config.road_color,
                    "line-width": [
                        "interpolate",
                        ["exponential", 1.5],
                        ["zoom"],
                        10,
                        0.5,
                        14,
                        3,
                        18,
                        12,
                    ],
                    "line-opacity": 0.85,
                },
                "layout": {"line-cap": "round", "line-join": "round"},
            },
            {
                "id": "roads-minor",
                "type": "line",
                "source": "roads",
                "source-layer": "map_roads",
                "filter": [
                    "in",
                    ["get", "road_class"],
                    ["literal", ["tertiary", "residential", "unclassified"]],
                ],
                "paint": {
                    "line-color": style_config.road_color,
                    "line-width": [
                        "interpolate",
                        ["exponential", 1.5],
                        ["zoom"],
                        12,
                        0.5,
                        14,
                        2,
                        18,
                        8,
                    ],
                    "line-opacity": 0.75,
                },
                "layout": {"line-cap": "round", "line-join": "round"},
            },
        ]
