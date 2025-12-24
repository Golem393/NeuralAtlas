from enum import Enum
from typing import Protocol
import duckdb
import geopandas as gpd
#import osmnx as ox

class MapSource(str, Enum):
    OVERTURE = "overture"
    OSM = "osm"
    TUM_GBA = "tum_gba"


class MapSourceAdapter(Protocol):
    def fetch_buildings(self, bbox: tuple[float, float, float, float]) -> list[dict]:
        pass

    def fetch_streets(self, bbox: tuple[float, float, float, float]) -> list[dict]:
        pass

    def fetch_landuse(self, bbox: tuple[float, float, float, float]) -> list[dict]:
        pass


class OvertureAdapter:
    def __init__(self, region="us-west-2", release="2024-11-13.0"):
        self.conn = duckdb.connect(database=':memory:') 
        self.release = release        
        self.base_url = f"s3://overturemaps-{region}/release/{release}" 
        self.conn.execute("INSTALL spatial; LOAD spatial;")
        self.conn.execute("INSTALL httpfs; LOAD httpfs;")
        self.conn.execute(f"SET s3_region='{region}';")

    
    def _fetch_to_gdf(self, query: str):
        df = self.conn.execute(query).df() 
        if 'geometry' in df.columns:
            return gpd.GeoDataFrame(df, geometry=gpd.points_from_xy([0]*len(df), [0]*len(df)) if df.empty else df['geometry'])
        return df


    def fetch_buildings(self, bbox: tuple[float, float, float, float]):
        query = f"""
        SELECT 
            id,
            height,
            num_floors,
            class, 
            ST_GeomFromWKB(geometry) as geometry,
        FROM read_parquet('{self.base_url}/theme=buildings/type=building/*', hive_partitioning=1)
        WHERE bbox.xmin BETWEEN {bbox[0]} AND {bbox[2]}
          AND bbox.ymin BETWEEN {bbox[1]} AND {bbox[3]}
        """
        return self._fetch_to_gdf(query)
    

    def fetch_streets(self, bbox: tuple[float, float, float, float]):
        query = f"""
        SELECT 
            id,
            class,
            subtype,
            surface,
            ST_GeomFromWKB(geometry) as geometry
        FROM read_parquet('{self.base_url}/theme=transportation/type=segment/*', hive_partitioning=1)
        WHERE bbox.xmin BETWEEN {bbox[0]} AND {bbox[2]}
          AND bbox.ymin BETWEEN {bbox[1]} AND {bbox[3]}
        """
        return self._fetch_to_gdf(query)
    

    def fetch_landuse(self, bbox: tuple[float, float, float, float]):
        query = f"""
        SELECT 
            id,
            class,
            subtype,
            ST_GeomFromWKB(geometry) as geometry
        FROM read_parquet('{self.base_url}/theme=base/type=land/*', hive_partitioning=1)
        WHERE bbox.xmin BETWEEN {bbox[0]} AND {bbox[2]}
          AND bbox.ymin BETWEEN {bbox[1]} AND {bbox[3]}
        """
        return self._fetch_to_gdf(query)

class OSMAdapter:
    def __init__(self):
        pass
        #ox.settings.timeout = 180
        #ox.settings.use_cache = True

    """def get_buildings(self, bbox):
        south, west, north, east = bbox[1], bbox[0], bbox[3], bbox[2]
        gdf = ox.features_from_bbox(north, south, east, west, tags={'building': True})
        return gdf[['id', 'nodes', 'building', 'height', 'geometry']] if not gdf.empty else gdf

    def get_streets(self, bbox):
        south, west, north, east = bbox[1], bbox[0], bbox[3], bbox[2]
        graph = ox.graph_from_bbox(north, south, east, west, network_type='drive')
        nodes, edges = ox.graph_to_gdfs(graph)
        return edges

    def get_terrain_landuse(self, bbox):
        south, west, north, east = bbox[1], bbox[0], bbox[3], bbox[2]
        tags = {'landuse': True, 'natural': ['wood', 'water', 'scrub']}
        gdf = ox.features_from_bbox(north, south, east, west, tags=tags)
        return gdf"""

class MapSourceManager:
    def __init__(self):
        self.adapters = {
            MapSource.OVERTURE: OvertureAdapter(),
            MapSource.OSM: OSMAdapter(),
        }
    
    def get_adapter(self, source: MapSource) -> MapSourceAdapter:
        return self.adapters[source]
