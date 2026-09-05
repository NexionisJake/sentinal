import { createElement } from "react";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Droplets, Wind, Mountain, Flame, Activity, Cross, Shield, Truck, Home } from "lucide-react";
import type { HazardType, Severity, FacilityType } from "../types";
import { severityColor } from "./hazardStyles";

const hazardIconMap: Record<HazardType, typeof Droplets> = {
  flood: Droplets,
  cyclone: Wind,
  landslide: Mountain,
  fire: Flame,
  earthquake: Activity,
};

const facilityIconMap: Record<FacilityType, typeof Cross> = {
  hospital: Cross,
  police: Shield,
  fire: Truck,
  ambulance: Truck,
  shelter: Home,
};

const facilityColor: Record<FacilityType, string> = {
  hospital: "#38bdf8",
  police: "#38bdf8",
  fire: "#38bdf8",
  ambulance: "#38bdf8",
  shelter: "#a78bfa",
};

export function makeHazardIcon(type: HazardType, severity: Severity): L.DivIcon {
  const Icon = hazardIconMap[type];
  const color = severityColor[severity];
  const pulse = severity === "critical" || severity === "high";
  const svg = renderToStaticMarkup(
    createElement(Icon, {
      size: 14,
      color: "#0a0e17",
      strokeWidth: 2.5,
    })
  );
  const html = `
    <div style="position:relative;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">
      ${pulse ? `<div class="pulse-ring" style="position:absolute;width:26px;height:26px;border-radius:9999px;background:${color};"></div>` : ""}
      <div style="position:relative;width:26px;height:26px;border-radius:9999px;background:${color};border:2px solid #0a0e17;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px ${color}55;">
        ${svg}
      </div>
    </div>`;
  return L.divIcon({ html, className: "hazard-marker", iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -14] });
}

export function makeFacilityIcon(type: FacilityType, emphasized = false): L.DivIcon {
  const Icon = facilityIconMap[type];
  const color = facilityColor[type];
  const size = emphasized ? 26 : 22;
  const svg = renderToStaticMarkup(
    createElement(Icon, {
      size: size * 0.5,
      color: "#0a0e17",
      strokeWidth: 2.5,
    })
  );
  const html = `
    <div style="width:${size}px;height:${size}px;border-radius:6px;background:${color};border:2px solid #0a0e17;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px ${color}55;">
      ${svg}
    </div>`;
  return L.divIcon({ html, className: "hazard-marker", iconSize: [size, size], iconAnchor: [size / 2, size / 2], popupAnchor: [0, -size / 2] });
}

export function makeSelectedIcon(): L.DivIcon {
  const html = `
    <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
      <div class="pulse-ring" style="position:absolute;width:30px;height:30px;border-radius:9999px;background:#ef4444;"></div>
      <div style="position:relative;width:18px;height:18px;border-radius:9999px;background:#ef4444;border:3px solid #0a0e17;box-shadow:0 0 0 3px #ef444488;"></div>
    </div>`;
  return L.divIcon({ html, className: "hazard-marker", iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -18] });
}