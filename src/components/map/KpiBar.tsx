import type { KpiSummary } from "../../types";

export function KpiBar({ kpi }: { kpi: KpiSummary | null }) {
  const cards = [
    { label: "Active Hazards", value: kpi?.activeHazards, accent: "text-high" },
    { label: "People At Risk", value: kpi?.peopleAtRisk, accent: "text-critical" },
    { label: "Red Zones", value: kpi?.redZones, accent: "text-critical" },
    { label: "Safe Relocation Sites", value: kpi?.safeRelocationSites, accent: "text-low" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-4 sm:px-6 py-4 border-t border-command-border bg-command-900">
      {cards.map((c) => (
        <div key={c.label} className="rounded-lg border border-command-border bg-command-850 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-gray-500">{c.label}</p>
            <span className="text-[9px] rounded border border-command-600 px-1.5 py-0.5 text-gray-500">DEMO DATA</span>
          </div>
          <p className={`mt-1 text-2xl font-bold font-mono ${c.accent}`}>
            {c.value !== undefined ? c.value.toLocaleString("en-IN") : "—"}
          </p>
        </div>
      ))}
    </div>
  );
}
