export type HazardType = "flood" | "cyclone" | "landslide" | "fire" | "earthquake";

export type Severity = "critical" | "high" | "moderate" | "low";

export interface District {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface DisasterEvent {
  id: string;
  type: HazardType;
  district: string;
  lat: number;
  lng: number;
  severity: Severity;
  riskScore: number;
  affectedPopulation: number;
  affectedVillages: number;
  detectedAt: string;
  status: "ACTIVE" | "MONITORING" | "RESOLVED";
  recommendedAction: string;
}

export interface FloodZone {
  id: string;
  district: string;
  coordinates: [number, number][];
}

export interface PopulationPoint {
  id: string;
  district: string;
  lat: number;
  lng: number;
  density: "high" | "medium" | "low";
  value: number;
}

export type FacilityType = "hospital" | "police" | "fire" | "ambulance" | "shelter";

export interface Facility {
  id: string;
  type: FacilityType;
  name: string;
  district: string;
  lat: number;
  lng: number;
  status: string;
  statusOk: boolean;
  metricLabel: string;
  metricValue: string;
  distanceKm: number;
  travelTimeMin: number;
}

export interface RoadSegment {
  id: string;
  name: string;
  coordinates: [number, number][];
}

export interface MapLayerState {
  disasterLocations: boolean;
  floodZones: boolean;
  cycloneZones: boolean;
  landslideZones: boolean;
  populationDensity: boolean;
  roads: boolean;
  hospitals: boolean;
  police: boolean;
  fire: boolean;
  evacuationRoutes: boolean;
  safeRelocationSites: boolean;
  cityRiskZones?: boolean;
}

export interface SafeSite {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  capacity: number;
  occupancy: number;
}

export interface KpiSummary {
  activeHazards: number;
  peopleAtRisk: number;
  redZones: number;
  safeRelocationSites: number;
}

export type SOSMessageType =
  | "MEDICAL_EMERGENCY"
  | "TRAPPED_FLOOD"
  | "FIRE_HAZARD"
  | "STRUCTURAL_COLLAPSE"
  | "CUSTOM";

export type SOSStatus = "PENDING" | "ACKNOWLEDGED" | "DISPATCHED" | "RESOLVED";

export type SOSPriority = "CRITICAL" | "HIGH" | "MEDIUM";

export interface SOSAlert {
  id: string;
  timestamp: string;
  senderName?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  messageType: SOSMessageType;
  messageText: string;
  status: SOSStatus;
  priority: SOSPriority;
  district?: string;
}

export interface GovUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

export type RiskZoneLevel = "RED" | "ORANGE" | "YELLOW" | "GREEN";

export interface CityRiskProfile {
  id: string;
  name: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  zone: RiskZoneLevel;
  riskScore: number;
  primaryThreat: string;
  activeAlertCount: number;
  nearestSafeSiteDistanceKm: number;
  lastUpdated: string;
}

export type UserRole = "CITIZEN" | "OFFICIAL" | "GUEST";

export interface UserSession {
  id: string;
  name: string;
  role: UserRole;
  badgeNumber?: string;
  phone?: string;
  email?: string;
  department?: string;
}

export type ShelterType =
  | "CYCLONE_SHELTER"
  | "COMMUNITY_HALL"
  | "RELIEF_CAMP"
  | "SCHOOL"
  | "STADIUM";

export type ShelterStatus =
  | "OPEN"
  | "NEAR_CAPACITY"
  | "NEAR_FULL"
  | "FULL"
  | "INACCESSIBLE"
  | "CLOSED";

export type ShelterAmenity =
  | "FOOD"
  | "WATER"
  | "MEDICAL"
  | "POWER_BACKUP"
  | "PET_FRIENDLY";

export interface ShelterFacility {
  id: string;
  name: string;
  district?: string;
  type: ShelterType;
  coordinates: { lat: number; lng: number };
  totalCapacity: number;
  currentOccupancy: number;
  status: ShelterStatus;
  amenities: (ShelterAmenity | string)[];
  contactNumber?: string;
  contact?: string;
  distanceKm?: number;
  estimatedTravelTime?: string;
}
