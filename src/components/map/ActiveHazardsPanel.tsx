import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DisasterEvent, Severity } from "../../types";
import { hazardEmoji, severityDotClasses, severityLabel } from "../../lib/hazardStyles";

interface Props {
  disasters: DisasterEvent[];
  counts: Record<Severity, number>;
  onSelect: (d: DisasterEvent) => void;
  selectedId?: string;
}

export function ActiveHazardsPanel({ disasters, counts, onSelect, selectedId }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="absolute left-3 top-3 z-[500] flex h-9 w-9 items-center justify-center rounded-lg border border-command-border bg-command-900/90 backdrop-blur text-gray-300 hover:text-white shadow-lg"
        aria-label="Expand active hazards panel"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="absolute left-3 top-3 z-[500] w-64 max-h-[calc(100%-24px)] flex flex-col rounded-lg border border-command-border bg-command-900/90 backdrop-blur shadow-lg">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-command-border">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-300">Active Hazards</p>
        <button onClick={() => setCollapsed(true)} className="text-gray-500 hover:text-gray-200" aria-label="Collapse panel">
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1.5 px-3 py-2.5 border-b border-command-border">
        {(["critical", "high", "moderate", "low"] as Severity[]).map((sev) => (
          <div key={sev} className="rounded border border-command-border bg-command-850 px-1.5 py-1.5 text-center">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${severityDotClasses[sev]} mb-1`} />
            <p className="text-sm font-bold text-gray-100 leading-none">{counts[sev]}</p>
            <p className="text-[8px] uppercase text-gray-500 mt-0.5">{severityLabel[sev]}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-command-border">
        {disasters.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelect(d)}
            className={`w-full text-left px-3 py-2.5 hover:bg-command-800 transition-colors ${
              selectedId === d.id ? "bg-command-800" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-100">{d.district}</p>
              <span className={`h-1.5 w-1.5 rounded-full ${severityDotClasses[d.severity]}`} />
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {hazardEmoji[d.type]} {d.type[0].toUpperCase() + d.type.slice(1)} · Risk {d.riskScore}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
