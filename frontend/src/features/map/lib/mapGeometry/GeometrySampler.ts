import type { SampledObject} from './types';
import type { SamplerConfig } from '../../types';
import { SeededRandom, generatePointsInPolygon} from './utils';

export class GeometrySampler {
    private config: Required<SamplerConfig>;
    private random: SeededRandom;

    constructor(config: Partial<SamplerConfig> = {}) {
    this.config = {
      density: 25,
      minScale: 0.8,
      maxScale: 1.2,
      minRotation: 0,
      maxRotation: 360,
      maxObjects: 1000,
      jitter: 1,
      variants: 1,
      seed: Math.random().toString(36),
      elevationOffset: 0,
      ...config,
    };
    this.random = new SeededRandom(this.config.seed);
  }


  sampleInPolygon(polygonRing: number[][]): SampledObject[] {
    const points = generatePointsInPolygon(
        polygonRing, 
        this.config.density, 
        this.config.maxObjects, 
        this.random
    );

    return points.map(([x, y]) => ({
        position: [x, y, this.config.elevationOffset || 0],
        rotation: this.random.range(this.config.minRotation, this.config.maxRotation),
        scale: this.random.range(this.config.minScale, this.config.maxScale),
        variant: this.config.variants ? this.random.int(this.config.variants) : 0,
    }));
  }

  sampleAlongLine(lineCoords: number[][], spacing: number = 0.001): SampledObject[] {
    const objects: SampledObject[] = [];
    let distanceToNextPoint = 0;

    for (let i = 0; i < lineCoords.length - 1; i++) {
      const [x1, y1] = lineCoords[i];
      const [x2, y2] = lineCoords[i + 1];

      const dx = x2 - x1;
      const dy = y2 - y1;
      const segmentLength = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      while (distanceToNextPoint <= segmentLength) {
        const t = segmentLength === 0 ? 0 : distanceToNextPoint / segmentLength;

            objects.push({
                position: [
                    x1 + dx * t, 
                    y1 + dy * t, 
                    this.config.elevationOffset || 0
                ],
                rotation: angle + this.random.range(-15, 15), 
                scale: this.random.range(this.config.minScale, this.config.maxScale),
                variant: this.config.variants ? this.random.int(this.config.variants) : 0,
            });
            distanceToNextPoint += spacing;
      }
      distanceToNextPoint -= segmentLength;
    }

    return objects;
  }

  sampleAtPoints(points: number[][]): SampledObject[] {
    return points.map(([lon, lat]) => ({
      position: [lon, lat, this.config.elevationOffset || 0],
      rotation: this.random.range(this.config.minRotation, this.config.maxRotation),
      scale: this.random.range(this.config.minScale, this.config.maxScale),
      variant: this.config.variants ? this.random.int(this.config.variants) : 0,
    }));
  }

  updateConfig(newConfig: Partial<SamplerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.seed) {
      this.random = new SeededRandom(newConfig.seed);
    }
  }

}