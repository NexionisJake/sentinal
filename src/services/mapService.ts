import { populationPoints } from "../data/villages";
import { roads } from "../data/roads";
import { defaultLayerState } from "../data/mapLayers";
import type { MapLayerState, PopulationPoint, RoadSegment } from "../types";

const SIMULATED_LATENCY_MS = 120;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

export const mapService = {
  // GET /api/map/layers
  async getDefaultLayerState(): Promise<MapLayerState> {
    return delay(defaultLayerState);
  },

  // GET /api/map/population-density
  async getPopulationPoints(): Promise<PopulationPoint[]> {
    return delay(populationPoints);
  },

  // GET /api/map/roads
  async getRoads(): Promise<RoadSegment[]> {
    return delay(roads);
  },
};
