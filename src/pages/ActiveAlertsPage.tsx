import { useEffect, useState } from "react";
import { Header } from "../components/layout/Header";
import { AlertCard } from "../components/alerts/AlertCard";
import { disasterService } from "../services/disasterService";
import { useAppContext } from "../context/AppContext";
import type { DisasterEvent, Severity } from "../types";

const SEVERITY_ORDER: Severity[] = ["critical", "high", "moderate", "low"];

export function ActiveAlertsPage() {
  const { setSelectedDisaster, requestMapFocus, setActivePage } = useAppContext();
  const [disasters, setDisasters] = useState<DisasterEvent[]>([]);
  const [filter, setFilter] = useState<Severity | "all">("all");

  useEffect(() => {
    disasterService.getDisasters().then(setDisasters);
  }, []);

  const sorted = [...disasters].sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));
  const visible = filter === "all" ? sorted : sorted.filter((d) => d.severity === filter);

  function handleViewOnMap(d: DisasterEvent) {
    setSelectedDisaster(d);
    requestMapFocus(d.lat, d.lng, 11);
    setActivePage("map");
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      <Header title="🚨 Active Disaster Alerts" subtitle="Consolidated feed of simulated hazard alerts across Tamil Nadu." />

      <div className="px-4 sm:px-6 py-3 flex flex-wrap gap-2 border-b border-command-border bg-command-900">
        {(["all", ...SEVERITY_ORDER] as (Severity | "all")[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider border transition-colors ${
              filter === s
                ? "bg-infra/15 border-infra/40 text-infra"
                : "border-command-border text-gray-400 hover:text-gray-200"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visible.map((d) => (
          <AlertCard key={d.id} disaster={d} onViewOnMap={() => handleViewOnMap(d)} />
        ))}
        {visible.length === 0 && <p className="text-sm text-gray-500">No alerts match this filter.</p>}
      </div>
    </div>
  );
}
