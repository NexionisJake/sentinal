import { MapPin } from "lucide-react";
import type { DisasterEvent } from "../../types";
import { hazardLabel, severityBadgeClasses, severityLabel } from "../../lib/hazardStyles";

const borderBySeverity: Record<DisasterEvent["severity"], string> = {
  critical: "border-l-4 border-l-critical",
  high: "border-l-4 border-l-high",
  moderate: "border-l-4 border-l-moderate",
  low: "border-l-4 border-l-low",
};

export function AlertCard({ disaster, onViewOnMap }: { disaster: DisasterEvent; onViewOnMap: () => void }) {
  return (
    <div className={`rounded-lg border border-command-border bg-command-850 p-4 ${borderBySeverity[disaster.severity]}`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${severityBadgeClasses[disaster.severity]}`}>
          {severityLabel[disaster.severity]}
        </span>
        <span className="text-[11px] text-gray-500">{disaster.detectedAt}</span>
      </div>

      <p className="mt-2 text-sm font-bold text-gray-100">
        {hazardLabel[disaster.type]} Risk — {disaster.district}
      </p>

      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400">
        <span>
          Risk Score: <span className="font-mono font-semibold text-gray-200">{disaster.riskScore}/100</span>
        </span>
        <span>
          Affected Population:{" "}
          <span className="font-mono font-semibold text-gray-200">{disaster.affectedPopulation.toLocaleString("en-IN")}</span>
        </span>
      </div>

      {disaster.recommendedAction && (
        <div className="mt-2">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Recommended Action</p>
          <p className="text-xs text-gray-200 mt-0.5">{disaster.recommendedAction}</p>
        </div>
      )}

      <button
        onClick={onViewOnMap}
        className="mt-3 flex items-center gap-1.5 rounded-md border border-infra/40 bg-infra/10 px-3 py-1.5 text-[11px] font-semibold text-infra hover:bg-infra/20 transition-colors"
      >
        <MapPin className="h-3.5 w-3.5" /> VIEW ON MAP
      </button>
    </div>
  );
}
