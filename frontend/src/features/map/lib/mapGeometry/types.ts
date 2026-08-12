export interface SampledObject {
  position: [number, number, number];
  rotation: number;
  scale: number;
  variant?: number;
}

export type BBox = [west: number, south: number, east: number, north: number];

export interface Triangle {
  p1: number[];
  p2: number[];
  p3: number[];
  area: number;
}