import { Building2, Users, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { shelterService } from "../../services/shelterService";

interface Props {
  stats?: {
    total: number;
    open: number;
    nearFull: number;
    full: number;
    closed: number;
    totalCapacity: number;
    totalOccupancy: number;
    availableSpots: number;
  };
}

const kpis = [
  {
    key: "total",
    label: "Total Shelters",
    icon: Building2,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
  },
  {
    key: "open",
    label: "Open Shelters",
    icon: CheckCircle,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
  {
    key: "availableSpots",
    label: "Available Spots",
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    key: "nearFull",
    label: "Near Capacity",
    icon: AlertCircle,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  {
    key: "full",
    label: "At Capacity",
    icon: XCircle,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
] as const;

export function ShelterStats({ stats: passedStats }: Props) {
  const stats = passedStats || shelterService.getShelterStats();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const value = stats[kpi.key as keyof typeof stats];
        return (
          <div
            key={kpi.key}
            className={`${kpi.bgColor} ${kpi.borderColor} border rounded-xl p-3.5 flex items-center gap-3 transition-all hover:scale-[1.02] shadow-md`}
          >
            <div className={`${kpi.bgColor} rounded-lg p-2 shrink-0`}>
              <Icon className={`h-5 w-5 ${kpi.color}`} strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold truncate">
                {kpi.label}
              </p>
              <p className={`text-xl font-black ${kpi.color} font-mono mt-0.5`}>
                {typeof value === "number" ? value.toLocaleString("en-IN") : value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
