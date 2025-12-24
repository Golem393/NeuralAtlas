from abc import ABC, abstractmethod
from typing import Dict, Any

class MapLayer(ABC):
    @abstractmethod
    def get_source(self, base_url: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_layers(self, style_config: Any) -> list[Dict[str, Any]]:
        pass