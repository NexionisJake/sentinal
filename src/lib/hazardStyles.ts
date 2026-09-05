import type { HazardType, Severity } from "../types";
import { Droplets, Wind, Mountain, Flame, Activity } from "lucide-react";

export const severityColor: Record<Severity, string> = {
  critical: "#ef4444",
  high: "#f97316",
  moderate: "#eab308",
  low: "#22c55e",
};

export const severityBadgeClasses: Record<Severity, string> = {
  critical: "bg-red-500/15 text-red-400 border border-red-500/40",
  high: "bg-orange-500/15 text-orange-400 border border-orange-500/40",
  moderate: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/40",
  low: "bg-green-500/15 text-green-400 border border-green-500/40",
};

export const severityDotClasses: Record<Severity, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  moderate: "bg-yellow-500",
  low: "bg-green-500",
};

export const severityLabel: Record<Severity, string> = {
  critical: "CRITICAL",
  high: "HIGH",
  moderate: "MODERATE",
  low: "LOW",
};

export const hazardIcon: Record<HazardType, typeof Droplets> = {
  flood: Droplets,
  cyclone: Wind,
  landslide: Mountain,
  fire: Flame,
  earthquake: Activity,
};

export const hazardLabel: Record<HazardType, string> = {
  flood: "Flood",
  cyclone: "Cyclone",
  landslide: "Landslide",
  fire: "Forest Fire",
  earthquake: "Earthquake",
};

export const hazardEmoji: Record<HazardType, string> = {
  flood: "🌊",
  cyclone: "🌀",
  landslide: "⛰️",
  fire: "🔥",
  earthquake: "🌍",
};
