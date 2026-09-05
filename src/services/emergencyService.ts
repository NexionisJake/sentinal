import { hospitals } from "../data/hospitals";
import { policeStations } from "../data/policeStations";
import { fireStations } from "../data/fireStations";
import { safeSites } from "../data/safeSites";
import type { Facility, SafeSite } from "../types";

const SIMULATED_LATENCY_MS = 120;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

function nearestForDistrict(list: Facility[], district: string): Facility {
  const match = list.find((f) => f.district === district);
  return match ?? list[0];
}

export const emergencyService = {
  // GET /api/hospitals/nearest?district=
  async getNearestHospital(district: string): Promise<Facility> {
    return delay(nearestForDistrict(hospitals, district));
  },

  // GET /api/police/nearest?district=
  async getNearestPolice(district: string): Promise<Facility> {
    return delay(nearestForDistrict(policeStations, district));
  },

  // GET /api/fire/nearest?district=
  async getNearestFire(district: string): Promise<Facility> {
    return delay(nearestForDistrict(fireStations, district));
  },

  async getAllFacilities(): Promise<Facility[]> {
    return delay([...hospitals, ...policeStations, ...fireStations]);
  },

  async getSafeSites(): Promise<SafeSite[]> {
    return delay(safeSites);
  },
};
