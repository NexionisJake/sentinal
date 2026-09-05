import { disasters, floodZones, districts } from "../data/disasters";
import type { DisasterEvent, FloodZone, District, Severity } from "../types";

// This module is written as if it were calling a backend so it can later be
// swapped for real HTTP calls (e.g. GET /api/disasters) without touching the UI.

const SIMULATED_LATENCY_MS = 120;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

export const disasterService = {
  // GET /api/disasters
  async getDisasters(): Promise<DisasterEvent[]> {
    return delay(disasters);
  },

  // GET /api/disasters/:id
  async getDisasterById(id: string): Promise<DisasterEvent | undefined> {
    return delay(disasters.find((d) => d.id === id));
  },

  // GET /api/disasters/flood-zones
  async getFloodZones(): Promise<FloodZone[]> {
    return delay(floodZones);
  },

  // GET /api/districts
  async getDistricts(): Promise<District[]> {
    return delay(districts);
  },

  async getSeverityCounts(): Promise<Record<Severity, number>> {
    const counts: Record<Severity, number> = { critical: 0, high: 0, moderate: 0, low: 0 };
    disasters.forEach((d) => {
      counts[d.severity] += 1;
    });
    return delay(counts);
  },
};
