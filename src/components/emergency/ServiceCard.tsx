import { Cross, Shield, Truck, MapPin, Route } from "lucide-react";
import type { Facility, FacilityType } from "../../types";

const iconMap: Record<FacilityType, typeof Cross> = { hospital: Cross, police: Shield, fire: Truck, ambulance: Truck, shelter: Cross };
const titleMap: Record<FacilityType, string> = {
  hospital: "Nearest Hospital",
  police: "Nearest Police Station",
  fire: "Nearest Fire Station",
  ambulance: "Nearest Ambulance",
  shelter: "Nearest Shelter",
};

export function ServiceCard({
  facility,
  onViewOnMap,
  onRoute,
}: {
  facility: Facility;
  onViewOnMap: () => void;
  onRoute: () => void;
}) {
  const Icon = iconMap[facility.type];

  return (
    <div className="rounded-lg border border-command-border bg-command-850 p-4 flex flex-col">
      <div className="flex items-center gap-2 text-infra">
        <Icon className="h-4 w-4" />
        <p className="text-[11px] font-semibold uppercase tracking-wider">{titleMap[facility.type]}</p>
      </div>

      <p className="mt-2.5 text-base font-bold text-gray-100 leading-snug">{facility.name}</p>

      <div className="mt-3 grid grid-cols-2 gap-y-2 text-xs">
        <div>
          <p className="text-gray-500">Distance</p>
          <p className="font-mono font-semibold text-gray-100">{facility.distanceKm.toFixed(1)} km</p>
        </div>
        <div>
          <p className="text-gray-500">Est. Travel Time</p>
          <p className="font-mono font-semibold text-gray-100">{facility.travelTimeMin} min</p>
        </div>
        <div>
          <p className="text-gray-500">Status</p>
          <p className={`font-semibold ${facility.statusOk ? "text-low" : "text-critical"}`}>
            {facility.statusOk ? "🟢" : "🔴"} {facility.status}
          </p>
        </div>
        <div>
          <p className="text-gray-500">{facility.metricLabel}</p>
          <p className="font-mono font-semibold text-gray-100">{facility.metricValue}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onViewOnMap}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-md border border-command-border bg-command-800 py-2 text-[11px] font-semibold text-gray-300 hover:bg-command-700 transition-colors"
        >
          <MapPin className="h-3.5 w-3.5" /> VIEW ON MAP
        </button>
        <button
          onClick={onRoute}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-md border border-infra/40 bg-infra/10 py-2 text-[11px] font-semibold text-infra hover:bg-infra/20 transition-colors"
        >
          <Route className="h-3.5 w-3.5" /> ROUTE
        </button>
      </div>
    </div>
  );
}
