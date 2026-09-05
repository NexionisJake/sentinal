import { MapPin, ShieldAlert, AlertCircle, Home, Navigation } from "lucide-react";
import type { CityRiskProfile, RiskZoneLevel } from "../../types";
import { useAppContext } from "../../context/AppContext";

const ZONE_CONFIG: Record<
  RiskZoneLevel,
  {
    label: string;
    badgeClass: string;
    meterClass: string;
    borderClass: string;
  }
> = {
  RED: {
    label: "Red Zone (Critical)",
    badgeClass: "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse",
    meterClass: "bg-red-500",
    borderClass: "border-red-500/30 hover:border-red-500/60",
  },
  ORANGE: {
    label: "Orange Zone (High)",
    badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    meterClass: "bg-amber-500",
    borderClass: "border-amber-500/30 hover:border-amber-500/60",
  },
  YELLOW: {
    label: "Yellow Zone (Advisory)",
    badgeClass: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    meterClass: "bg-yellow-500",
    borderClass: "border-yellow-500/30 hover:border-yellow-500/60",
  },
  GREEN: {
    label: "Green Zone (Safe)",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    meterClass: "bg-emerald-500",
    borderClass: "border-emerald-500/30 hover:border-emerald-500/60",
  },
};

interface Props {
  city: CityRiskProfile;
  onLocateOnMap: (city: CityRiskProfile) => void;
}

export function CityRiskCard({ city, onLocateOnMap }: Props) {
  const { setUserLocation, setActivePage } = useAppContext();
  const config = ZONE_CONFIG[city.zone];

  return (
    <div
      className={`p-4 rounded-xl bg-command-900 border transition-all hover:shadow-xl flex flex-col justify-between ${config.borderClass}`}
    >
      <div>
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-cyan-400" />
              {city.name}
            </h3>
            <p className="text-[11px] text-gray-400 ml-5.5">{city.state}</p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${config.badgeClass}`}
          >
            {city.zone} ZONE
          </span>
        </div>

        {/* Primary Threat Summary */}
        <div className="mt-3.5 p-2.5 rounded-lg bg-command-950 border border-command-border/60">
          <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" /> Primary Threat
          </p>
          <p className="text-xs font-semibold text-gray-200 mt-1 leading-snug">
            {city.primaryThreat}
          </p>
        </div>

        {/* Risk Score Progress Bar */}
        <div className="mt-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 text-[11px]">Composite Risk Score</span>
            <span className="font-mono font-bold text-white">{city.riskScore} / 100</span>
          </div>
          <div className="h-2 w-full rounded-full bg-command-950 overflow-hidden border border-command-border">
            <div
              className={`h-full rounded-full transition-all duration-500 ${config.meterClass}`}
              style={{ width: `${city.riskScore}%` }}
            />
          </div>
        </div>

        {/* Metadata stats */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs border-t border-command-border/60 pt-3">
          <div className="flex items-center gap-1.5 text-gray-300">
            <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
            <span>
              Alerts: <strong className="font-mono text-white">{city.activeAlertCount}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-300">
            <Home className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>
              Safe Site: <strong className="font-mono text-cyan-300">{city.nearestSafeSiteDistanceKm} km</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onLocateOnMap(city)}
          className="flex-1 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Navigation className="h-3.5 w-3.5" />
          <span>LOCATE ON MAP</span>
        </button>
        <button
          onClick={() => {
            setUserLocation(city.coordinates);
            setActivePage("relocation");
          }}
          className="flex-1 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Home className="h-3.5 w-3.5" />
          <span>FIND SHELTER</span>
        </button>
      </div>
    </div>
  );
}
