from app.services.styles.buildings import BuildingLayer
from app.services.styles.landuse import LanduseLayer
from app.services.styles.roads import RoadLayer


class StyleBuilder:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.registry = {
            "buildings": BuildingLayer(),
            "roads": RoadLayer(),
            "landuse": LanduseLayer(),
        }

    def build(self, config):
        style = {
            "version": 8,
            "sources": {},
            "layers": [
                {
                    "id": "bg",
                    "type": "background",
                    "paint": {"background-color": config.style.background_color},
                }
            ],
        }

        if config.layers.show_buildings:
            layer_svc = self.registry["buildings"]
            style["sources"]["buildings"] = layer_svc.get_source(self.base_url)
            style["layers"].extend(layer_svc.get_layers(config.style))

        if config.layers.show_roads:
            layer_svc = self.registry["roads"]
            style["sources"]["roads"] = layer_svc.get_source(self.base_url)
            style["layers"].extend(layer_svc.get_layers(config.style))

        if config.layers.show_landuse:
            layer_svc = self.registry["landuse"]
            style["sources"]["landuse"] = layer_svc.get_source(self.base_url)
            style["layers"].extend(layer_svc.get_layers(config.style))

        return style
