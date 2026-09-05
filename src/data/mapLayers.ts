import type { MapLayerState } from "../types";

export const defaultLayerState: MapLayerState = {
  disasterLocations: true,
  cityRiskZones: true,
  floodZones: true,
  cycloneZones: true,
  landslideZones: true,
  populationDensity: true,
  roads: true,
  hospitals: true,
  police: true,
  fire: true,
  evacuationRoutes: false,
  safeRelocationSites: false,
};

export const layerLabels: { key: keyof MapLayerState; label: string }[] = [
  { key: "disasterLocations", label: "Disaster Locations" },
  { key: "cityRiskZones", label: "City Risk Zones (Red/Orange/Yellow/Green)" },
  { key: "floodZones", label: "Flood Zones" },
  { key: "cycloneZones", label: "Cyclone Zones" },
  { key: "landslideZones", label: "Landslide Zones" },
  { key: "populationDensity", label: "Population Density" },
  { key: "roads", label: "Roads" },
  { key: "hospitals", label: "Hospitals" },
  { key: "police", label: "Police Stations" },
  { key: "fire", label: "Fire Stations" },
  { key: "evacuationRoutes", label: "Evacuation Routes" },
  { key: "safeRelocationSites", label: "Safe Relocation Sites" },
];
