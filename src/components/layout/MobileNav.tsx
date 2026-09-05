import { Map, Building2, AlertTriangle, ShieldCheck, LayoutDashboard } from "lucide-react";
import { useAppContext, type PageKey } from "../../context/AppContext";

const ITEMS: { key: PageKey; label: string; icon: typeof Map }[] = [
  { key: "landing", label: "Home", icon: LayoutDashboard },
  { key: "map", label: "Map", icon: Map },
  { key: "emergency", label: "Services", icon: Building2 },
  { key: "alerts", label: "Alerts", icon: AlertTriangle },
  { key: "gov-dashboard", label: "Gov EOC", icon: ShieldCheck },
];

export function MobileNav() {
  const { activePage, setActivePage } = useAppContext();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-[1000] bg-command-900 border-t border-command-border flex">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = activePage === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setActivePage(item.key)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] ${
              active ? "text-infra" : "text-gray-500"
            }`}
          >
            <Icon className="h-4.5 w-4.5" strokeWidth={2} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
