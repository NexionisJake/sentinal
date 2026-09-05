import type { DisasterEvent } from "../../types";
import { hazardLabel, severityBadgeClasses, severityLabel } from "../../lib/hazardStyles";
import { useAppContext } from "../../context/AppContext";

export function HazardPopupCard({ disaster, onViewDetails }: { disaster: DisasterEvent; onViewDetails: () => void }) {
  const { setUserLocation, setActivePage } = useAppContext();

  return (
    <div className="p-3.5 w-full bg-command-900 text-slate-100 rounded-lg">
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
        {hazardLabel[disaster.type]} — {disaster.district}
      </p>
      <span className={`inline-block mt-1.5 rounded px-2 py-0.5 text-[10px] font-bold ${severityBadgeClasses[disaster.severity]}`}>
        {severityLabel[disaster.severity]}
      </span>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <div>
          <p className="text-[11px] text-slate-400">Risk Score</p>
          <p className="font-mono font-bold text-white text-sm">{disaster.riskScore} / 100</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400">Status</p>
          <p className="font-semibold text-white capitalize">{disaster.status}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400">Affected Population</p>
          <p className="font-mono font-medium text-slate-100">{disaster.affectedPopulation.toLocaleString("en-IN")}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400">Affected Villages</p>
          <p className="font-mono font-medium text-slate-100">{disaster.affectedVillages}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400">Detected</p>
          <p className="font-medium text-slate-200">{disaster.detectedAt}</p>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Recommended Action</p>
        <p className="text-xs text-slate-200 mt-1 leading-snug">{disaster.recommendedAction}</p>
      </div>

      <div className="mt-3.5 flex gap-2">
        <button
          onClick={onViewDetails}
          className="flex-1 rounded-md bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-bold py-2 hover:bg-cyan-500/30 transition-colors cursor-pointer"
        >
          VIEW DETAILS
        </button>
        <button
          onClick={() => {
            setUserLocation({ lat: disaster.lat, lng: disaster.lng });
            setActivePage("relocation");
          }}
          className="flex-1 rounded-md bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold py-2 hover:bg-emerald-500/30 transition-colors cursor-pointer"
        >
          FIND SHELTER
        </button>
      </div>
    </div>
  );
}
