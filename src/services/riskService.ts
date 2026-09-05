import { disasters } from "../data/disasters";
import { safeSites } from "../data/safeSites";
import type { KpiSummary } from "../types";

const SIMULATED_LATENCY_MS = 120;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

export const riskService = {
  // GET /api/risk
  async getKpiSummary(): Promise<KpiSummary> {
    const activeHazards = 28; // demo value, intentionally broader than the mock disaster array
    const peopleAtRisk = 124580;
    const redZones = 17;
    const safeRelocationSites = 43;
    return delay({ activeHazards, peopleAtRisk, redZones, safeRelocationSites });
  },

  async getRiskScoreForDistrict(district: string): Promise<number | undefined> {
    const match = disasters.find((d) => d.district === district);
    return delay(match?.riskScore);
  },

  async getSafeSiteCount(): Promise<number> {
    return delay(safeSites.length);
  },
};
