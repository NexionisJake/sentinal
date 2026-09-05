import { Map, Building2, AlertTriangle, BarChart3, Home, Settings, Radar, ShieldCheck } from "lucide-react";
import { useAppContext, type PageKey } from "../../context/AppContext";

const NAV_ITEMS: { key: PageKey; label: string; icon: typeof Map }[] = [
  { key: "map", label: "Disaster Map", icon: Map },
  { key: "emergency", label: "Emergency Services", icon: Building2 },
  { key: "alerts", label: "Active Alerts", icon: AlertTriangle },
  { key: "risk", label: "Risk Overview", icon: BarChart3 },
  { key: "relocation", label: "Relocation", icon: Home },
  { key: "gov-dashboard", label: "Gov Portal (EOC)", icon: ShieldCheck },
  { key: "settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { activePage, setActivePage, isGovAuthenticated, govUser, logoutGov } = useAppContext();

  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col bg-command-900 border-r border-command-border">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-command-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-infra/10 border border-infra/40">
          <Radar className="h-5 w-5 text-infra" strokeWidth={2} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-widest text-gray-100">SENTINEL-X</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Command Console</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.key || (item.key === "gov-dashboard" && activePage === "gov-login");
          return (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className={`w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-infra/10 text-infra border border-infra/30 font-semibold"
                  : "text-gray-400 border border-transparent hover:bg-command-800 hover:text-gray-200"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
              <span className="truncate">{item.label}</span>
              {item.key === "gov-dashboard" && (
                <span className="ml-auto flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-command-border space-y-2">
        {isGovAuthenticated ? (
          <div className="p-2.5 rounded-lg bg-command-950 border border-emerald-500/30 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>OFFICER LOGGED IN</span>
            </div>
            <p className="text-gray-300 font-medium mt-1 truncate">{govUser?.name}</p>
            <p className="text-[10px] text-gray-500 truncate">{govUser?.department}</p>
            <button
              onClick={logoutGov}
              className="mt-2 w-full py-1 rounded bg-command-800 hover:bg-command-750 text-[10px] text-gray-300 hover:text-white border border-command-border transition-colors"
            >
              Sign Out Officer
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-low animate-pulse" />
              Demonstration Mode
            </div>
            <p className="mt-1 text-[10px] text-gray-600 leading-snug">
              Tamil Nadu State Disaster Management Authority — Prototype
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
