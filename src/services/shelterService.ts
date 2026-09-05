import { shelters } from "../data/shelters";
import type { ShelterFacility, ShelterStatus, ShelterType } from "../types";

/** Haversine distance in km between two lat/lng points */
function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const shelterService = {
  getAllShelters(): ShelterFacility[] {
    return shelters;
  },

  getSheltersByDistrict(district: string): ShelterFacility[] {
    return shelters.filter(
      (s) => s.district && s.district.toLowerCase() === district.toLowerCase()
    );
  },

  getOpenShelters(): ShelterFacility[] {
    return shelters.filter(
      (s) => s.status === "OPEN" || s.status === "NEAR_FULL"
    );
  },

  getSheltersByType(type: ShelterType): ShelterFacility[] {
    return shelters.filter((s) => s.type === type);
  },

  getSheltersByStatus(status: ShelterStatus): ShelterFacility[] {
    return shelters.filter((s) => s.status === status);
  },

  /** Returns shelters sorted by distance from given coordinates, with distanceKm populated */
  getNearestShelters(
    lat: number,
    lng: number,
    count?: number
  ): ShelterFacility[] {
    const withDistance = shelters.map((s) => ({
      ...s,
      distanceKm: Math.round(
        haversineKm(lat, lng, s.coordinates.lat, s.coordinates.lng) * 10
      ) / 10,
    }));
    withDistance.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    return count ? withDistance.slice(0, count) : withDistance;
  },

  getShelterStats() {
    const total = shelters.length;
    const open = shelters.filter((s) => s.status === "OPEN").length;
    const nearFull = shelters.filter((s) => s.status === "NEAR_FULL").length;
    const full = shelters.filter((s) => s.status === "FULL").length;
    const closed = shelters.filter((s) => s.status === "CLOSED").length;
    const totalCapacity = shelters.reduce((sum, s) => sum + s.totalCapacity, 0);
    const totalOccupancy = shelters.reduce(
      (sum, s) => sum + s.currentOccupancy,
      0
    );
    const availableSpots = totalCapacity - totalOccupancy;

    return {
      total,
      open,
      nearFull,
      full,
      closed,
      totalCapacity,
      totalOccupancy,
      availableSpots,
    };
  },

  getUniqueDistricts(): string[] {
    return [...new Set(shelters.map((s) => s.district).filter(Boolean) as string[])].sort();
  },
};
