import { safeSites } from "../data/safeSites";
import { shelters as sampleShelters } from "../data/shelters";
import { disasters as defaultDisasters } from "../data/disasters";
import type { DisasterEvent, ShelterFacility, ShelterStatus } from "../types";

/**
 * Calculates Haversine distance in kilometers between two lat/lng coordinates.
 */
export function calculateDistance(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Helper to calculate shortest distance from point P to line segment AB (in km).
 */
export function distanceToLineSegmentKm(
  p: { lat: number; lng: number },
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const abDist = calculateDistance(a, b);
  if (abDist === 0) return calculateDistance(p, a);

  // Projection parameter t
  const dx = b.lng - a.lng;
  const dy = b.lat - a.lat;
  if (dx === 0 && dy === 0) return calculateDistance(p, a);

  const t = Math.max(
    0,
    Math.min(
      1,
      ((p.lng - a.lng) * dx + (p.lat - a.lat) * dy) / (dx * dx + dy * dy)
    )
  );

  const projection = {
    lat: a.lat + t * dy,
    lng: a.lng + t * dx,
  };

  return calculateDistance(p, projection);
}

/**
 * Normalizes and converts safeSites.ts data into ShelterFacility list combined with shelters.ts.
 */
export function getAllShelters(): ShelterFacility[] {
  const combined: ShelterFacility[] = [...sampleShelters];

  // Map safeSites entries if not already present
  for (const site of safeSites) {
    if (!combined.some((s) => s.id === site.id)) {
      const status: ShelterStatus =
        site.occupancy >= site.capacity ? "FULL" : "OPEN";
      combined.push({
        id: site.id,
        name: site.name,
        district: site.district,
        coordinates: { lat: site.lat, lng: site.lng },
        type: "RELIEF_CAMP",
        totalCapacity: site.capacity,
        currentOccupancy: site.occupancy,
        status,
        amenities: ["WATER", "FOOD", "MEDICAL", "POWER_BACKUP"],
        contactNumber: "+91 44 1070",
        contact: "+91 44 1070",
      });
    }
  }

  return combined;
}

/**
 * Calculates distance, filters out FULL or INACCESSIBLE shelters, and returns closest shelters.
 */
export function getNearestSafeShelters(
  userCoords: { lat: number; lng: number },
  maxResults = 5,
  customShelterList?: ShelterFacility[]
): ShelterFacility[] {
  const all = customShelterList || getAllShelters();

  // Filter out FULL, INACCESSIBLE, CLOSED or over-capacity shelters
  const eligible = all.filter((shelter) => {
    const isFull =
      shelter.status === "FULL" ||
      shelter.currentOccupancy >= shelter.totalCapacity;
    const isInaccessible =
      shelter.status === "INACCESSIBLE" || shelter.status === "CLOSED";
    return !isFull && !isInaccessible;
  });

  const withDistances = eligible.map((shelter) => {
    const distanceKm = calculateDistance(userCoords, shelter.coordinates);
    // Estimate drive time assuming avg speed ~30 km/h in emergency conditions
    const mins = Math.max(3, Math.round((distanceKm / 30) * 60));
    const estimatedTravelTime = `~${mins} mins drive`;

    return {
      ...shelter,
      distanceKm,
      estimatedTravelTime,
      contactNumber: shelter.contactNumber || shelter.contact || "+91 1070",
    };
  });

  // Sort by closest distance
  withDistances.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

  return maxResults ? withDistances.slice(0, maxResults) : withDistances;
}

/**
 * Checks if the direct transit route between user and shelter intersects an active hazard zone.
 */
export function isRouteCompromised(
  userCoords: { lat: number; lng: number },
  shelterCoords: { lat: number; lng: number },
  activeDisasters: DisasterEvent[] = defaultDisasters
): boolean {
  // Check against active/monitoring critical and high severity disasters
  const activeHazards = activeDisasters.filter(
    (d) => d.status !== "RESOLVED"
  );

  for (const hazard of activeHazards) {
    const hazardCoords = { lat: hazard.lat, lng: hazard.lng };
    const distToRoute = distanceToLineSegmentKm(
      hazardCoords,
      userCoords,
      shelterCoords
    );

    // Hazard danger radius: 6km for critical, 4km for high/moderate
    const dangerRadiusKm =
      hazard.severity === "critical"
        ? 6
        : hazard.severity === "high"
        ? 4.5
        : 3;

    if (distToRoute <= dangerRadiusKm) {
      return true;
    }
  }

  return false;
}

export const relocationService = {
  calculateDistance,
  distanceToLineSegmentKm,
  getAllShelters,
  getNearestSafeShelters,
  isRouteCompromised,
};
