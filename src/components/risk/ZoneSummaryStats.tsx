import { AlertOctagon, ShieldAlert, AlertTriangle, CheckCircle2, Layers } from "lucide-react";
import type { RiskZoneLevel } from "../../types";

interface Props {
  activeFilter: "ALL" | RiskZoneLevel;
  onSelectFilter: (filter: "ALL" | RiskZoneLevel) => void;
  stats: {
    TOTAL: number;
    RED: number;
    ORANGE: number;
    YELLOW: number;
    GREEN: number;
  };
}

export function ZoneSummaryStats({ activeFilter, onSelectFilter, stats }: Props) {
  const cards: {
    id: "ALL" | RiskZoneLevel;
    label: string;
    sub: string;
    count: number;
    icon: typeof AlertOctagon;
    borderClass: string;
    bgClass: string;
    textClass: string;
    badgeClass: string;
  }[] = [
    {
      id: "ALL",
      label: "All Monitored Cities",
      sub: "Total Regions Cataloged",
      count: stats.TOTAL,
      icon: Layers,
      borderClass: "border-command-border hover:border-cyan-500/50",
      bgClass: "bg-command-900",
      textClass: "text-gray-100",
      badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    },
    {
      id: "RED",
      label: "Red Zone",
      sub: "Critical Hazard & Evacuation",
      count: stats.RED,
      icon: AlertOctagon,
      borderClass: "border-red-500/30 hover:border-red-500/80",
      bgClass: "bg-red-950/30",
      textClass: "text-red-400",
      badgeClass: "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse",
    },
    {
      id: "ORANGE",
      label: "Orange Zone",
      sub: "High Alert & Border Threat",
      count: stats.ORANGE,
      icon: ShieldAlert,
      borderClass: "border-amber-500/30 hover:border-amber-500/80",
      bgClass: "bg-amber-950/30",
      textClass: "text-amber-400",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    },
    {
      id: "YELLOW",
      label: "Yellow Zone",
      sub: "Advisory & Watch Mode",
      count: stats.YELLOW,
      icon: AlertTriangle,
      borderClass: "border-yellow-500/30 hover:border-yellow-500/80",
      bgClass: "bg-yellow-950/30",
      textClass: "text-yellow-400",
      badgeClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    },
    {
      id: "GREEN",
      label: "Green Zone",
      sub: "Safe & Normal Operations",
      count: stats.GREEN,
      icon: CheckCircle2,
      borderClass: "border-emerald-500/30 hover:border-emerald-500/80",
      bgClass: "bg-emerald-950/30",
      textClass: "text-emerald-400",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = activeFilter === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onSelectFilter(c.id)}
            className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
              c.bgClass
            } ${c.borderClass} ${
              isSelected ? "ring-2 ring-cyan-400 border-transparent shadow-lg" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <Icon className={`h-5 w-5 ${c.textClass}`} />
              <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${c.badgeClass}`}>
                {c.count} CITIES
              </span>
            </div>
            <div className="mt-3">
              <p className={`text-xs font-bold uppercase tracking-wider ${c.textClass}`}>
                {c.label}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 truncate">{c.sub}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
