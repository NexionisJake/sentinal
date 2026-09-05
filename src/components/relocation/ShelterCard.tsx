import { MapPin, Phone, Navigation, Users, ShieldCheck, AlertTriangle, ExternalLink } from "lucide-react";
import type { ShelterFacility } from "../../types";
import { isRouteCompromised } from "../../services/relocationService";
import { useAppContext } from "../../context/AppContext";

interface Props {
  shelter: ShelterFacility;
  onLocateOnMap: (shelter: ShelterFacility) => void;
  isSelected?: boolean;
}

const typeLabel: Record<string, string> = {
  CYCLONE_SHELTER: "Cyclone Shelter",
  COMMUNITY_HALL: "Community Hall",
  RELIEF_CAMP: "Relief Camp",
  SCHOOL: "School",
  STADIUM: "Stadium",
};

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  OPEN: {
    label: "OPEN",
    className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
  NEAR_CAPACITY: {
    label: "NEAR CAPACITY",
    className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  },
  NEAR_FULL: {
    label: "NEAR FULL",
    className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  },
  FULL: {
    label: "FULL",
    className: "bg-red-500/20 text-red-300 border-red-500/40",
  },
  INACCESSIBLE: {
    label: "INACCESSIBLE",
    className: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  },
  CLOSED: {
    label: "CLOSED",
    className: "bg-gray-500/20 text-gray-400 border-gray-500/40",
  },
};

const amenityBadge: Record<string, { label: string; icon: string }> = {
  FOOD: { label: "Food Supply", icon: "🍲" },
  WATER: { label: "Potable Water", icon: "💧" },
  MEDICAL: { label: "Medical Bay", icon: "🏥" },
  POWER_BACKUP: { label: "Generator / Power", icon: "⚡" },
  PET_FRIENDLY: { label: "Pet-Friendly", icon: "🐾" },
};

function renderAmenityTag(amenity: string) {
  const normalized = amenity.toUpperCase().replace(/\s+/g, "_");
  const meta = amenityBadge[normalized];
  if (meta) {
    return (
      <span
        key={amenity}
        className="text-[10px] px-2 py-0.5 rounded-md bg-command-800 text-gray-200 border border-command-border flex items-center gap-1 font-medium"
      >
        <span>{meta.icon}</span>
        <span>{meta.label}</span>
      </span>
    );
  }
  return (
    <span
      key={amenity}
      className="text-[10px] px-2 py-0.5 rounded-md bg-command-800 text-gray-300 border border-command-border font-medium"
    >
      {amenity}
    </span>
  );
}

export function ShelterCard({ shelter, onLocateOnMap, isSelected }: Props) {
  const { userLocation } = useAppContext();

  const occupancyPercent = Math.min(
    100,
    Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100)
  );

  const barColor =
    occupancyPercent >= 90
      ? "bg-red-500"
      : occupancyPercent >= 70
      ? "bg-yellow-500"
      : "bg-emerald-500";

  const status = statusConfig[shelter.status] ?? statusConfig.CLOSED;

  // Route safety evaluation
  const routeCompromised = userLocation
    ? isRouteCompromised(userLocation, shelter.coordinates)
    : false;

  const contactNumber = shelter.contactNumber || shelter.contact;

  return (
    <div
      className={`bg-command-900 border rounded-xl p-4 transition-all duration-200 shadow-md ${
        isSelected
          ? "border-cyan-400 ring-1 ring-cyan-400/40 bg-cyan-950/20"
          : "border-command-border hover:border-cyan-500/40"
      }`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white truncate hover:text-cyan-300 transition-colors">
            {shelter.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-cyan-300 bg-cyan-950 border border-cyan-500/30 px-2 py-0.5 rounded">
              {typeLabel[shelter.type] ?? shelter.type}
            </span>
            {shelter.district && (
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-cyan-400" />
                {shelter.district}
              </span>
            )}
          </div>
        </div>
        <span
          className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Distance & ETA Badge */}
      <div className="flex items-center justify-between text-xs bg-command-950/80 border border-command-border/60 rounded-lg px-3 py-2 mb-3">
        <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
          <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span>
            {shelter.distanceKm != null
              ? `${shelter.distanceKm} km away`
              : "Distance pending"}
          </span>
          {shelter.estimatedTravelTime && (
            <span className="text-gray-400 text-[11px]">
              • {shelter.estimatedTravelTime}
            </span>
          )}
        </div>

        {/* Hazard Safety Indicator */}
        {routeCompromised ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded animate-pulse">
            <AlertTriangle className="h-3 w-3" />
            <span>Caution: Nearby Hazard</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
            <ShieldCheck className="h-3 w-3" />
            <span>Route Clear</span>
          </span>
        )}
      </div>

      {/* Live Capacity Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-gray-400 flex items-center gap-1 font-medium">
            <Users className="h-3.5 w-3.5 text-gray-400" />
            Shelter Capacity & Occupancy
          </span>
          <span className="font-mono text-gray-200 text-xs">
            <strong className="text-white">
              {shelter.currentOccupancy.toLocaleString()}
            </strong>{" "}
            / {shelter.totalCapacity.toLocaleString()}{" "}
            <span className="text-gray-400">({occupancyPercent}%)</span>
          </span>
        </div>
        <div className="h-2.5 bg-command-950 rounded-full overflow-hidden border border-command-border">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>
      </div>

      {/* Amenity Pills */}
      {shelter.amenities && shelter.amenities.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {shelter.amenities.map((amenity) => renderAmenityTag(amenity))}
        </div>
      )}

      {/* Contact Line */}
      {contactNumber && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3 pt-1 border-t border-command-border/40">
          <Phone className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="text-gray-300 font-mono text-[11px]">
            Helpline: {contactNumber}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onLocateOnMap(shelter)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>Show Route on Map</span>
        </button>

        <button
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${shelter.coordinates.lat},${shelter.coordinates.lng}`;
            window.open(url, "_blank");
          }}
          disabled={shelter.status === "FULL" || shelter.status === "INACCESSIBLE"}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        >
          <Navigation className="h-3.5 w-3.5" />
          <span>External Directions</span>
          <ExternalLink className="h-3 w-3 opacity-70" />
        </button>
      </div>
    </div>
  );
}
