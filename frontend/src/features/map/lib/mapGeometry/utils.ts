import type {Triangle} from './types';
import earcut from 'earcut';
import seedrandom from 'seedrandom';

export class SeededRandom {
  private rng: seedrandom.PRNG

  constructor(seed: string) {
    this.rng = seedrandom(seed);
  }

  next(): number {
    return this.rng();
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  int(max: number): number {
    return Math.floor(this.next() * max);
  }
}

export function generatePointsInPolygon(
    polygonRing: number[][],
    density: number, 
    maxObjects: number, 
    random: SeededRandom
    ): number[][] {

  const flatData = polygonRing.flat();
  const indices = earcut(flatData);
  const triangles: Triangle[] = [];
  let totalArea = 0;

  // Build Triangles & Total Area
  for (let i = 0; i < indices.length; i += 3) {
    const p1 = polygonRing[indices[i]];
    const p2 = polygonRing[indices[i + 1]];
    const p3 = polygonRing[indices[i + 2]];

    const area = Math.abs(
      (p2[0] - p1[0]) * (p3[1] - p1[1]) - 
      (p3[0] - p1[0]) * (p2[1] - p1[1])
    ) / 2;

    totalArea += area;
    triangles.push({ p1, p2, p3, area });
  }

  let targetTotal = Math.floor(totalArea * density * 10000);
  if (targetTotal > maxObjects) targetTotal = maxObjects;

  const countMultiplier = (targetTotal / totalArea);
  const points: number[][] = [];

  for (const t of triangles) {
    const exactCount = t.area * countMultiplier;
    const count = Math.floor(exactCount);

    /*  Stochastic Rounding - commented out for simplicity
    if (random.next() < (exactCount - count)) {
      count++;
    }*/

    for (let k = 0; k < count; k++) {
      points.push(getRandomPointInTriangle(t, random));
    }
  }

  return points;
}

function getRandomPointInTriangle(t: Triangle, random: SeededRandom): number[] {
  const r1 = random.next();
  const r2 = random.next();
  const sqrtR1 = Math.sqrt(r1);
  const u = 1 - sqrtR1;
  const v = sqrtR1 * (1 - r2);
  const w = sqrtR1 * r2;

  return [
    u * t.p1[0] + v * t.p2[0] + w * t.p3[0], 
    u * t.p1[1] + v * t.p2[1] + w * t.p3[1]
  ];
}

export function filterFeaturesByProperty(
  properties: Record<string, unknown>,
  keywords: string[]
): boolean {
  const values = Object.values(properties)
    .map((v) => String(v).toLowerCase())
    .join(' ');
  return keywords.some((kw) => values.includes(kw));
}