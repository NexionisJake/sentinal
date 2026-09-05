import { disasters } from "../data/disasters";
import { safeSites } from "../data/safeSites";
import { CITY_RISK_PROFILES } from "../data/cityRiskData";
import type { CityRiskProfile, KpiSummary, RiskZoneLevel } from "../types";

const SIMULATED_LATENCY_MS = 120;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

export const riskService = {
  // GET /api/risk
  async getKpiSummary(): Promise<KpiSummary> {
    const activeHazards = 28;
    const peopleAtRisk = 124580;
    const redZones = CITY_RISK_PROFILES.filter((c) => c.zone === "RED").length;
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

  // City Risk Profile Helper APIs
  getAllCityRiskProfiles(): CityRiskProfile[] {
    return CITY_RISK_PROFILES;
  },

  getCitiesByZone(zone: RiskZoneLevel): CityRiskProfile[] {
    return CITY_RISK_PROFILES.filter((city) => city.zone === zone);
  },

  getZoneStats() {
    const total = CITY_RISK_PROFILES.length;
    const red = CITY_RISK_PROFILES.filter((c) => c.zone === "RED").length;
    const orange = CITY_RISK_PROFILES.filter((c) => c.zone === "ORANGE").length;
    const yellow = CITY_RISK_PROFILES.filter((c) => c.zone === "YELLOW").length;
    const green = CITY_RISK_PROFILES.filter((c) => c.zone === "GREEN").length;

    return {
      TOTAL: total,
      RED: red,
      ORANGE: orange,
      YELLOW: yellow,
      GREEN: green,
    };
  },
};
