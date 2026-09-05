import { useEffect, useState } from "react";
import { ShieldCheck, AlertOctagon } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function Header({ title, subtitle }: { title: string; subtitle: string }) {
  const [now, setNow] = useState(new Date());
  const {
    currentUser,
    logout,
    openAuthModal,
    openSOSModal,
  } = useAppContext();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="border-b border-command-border bg-command-900/80 backdrop-blur shrink-0">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-2 text-[10px] uppercase tracking-wider bg-command-950 border-b border-command-border">
        <div className="flex items-center gap-1.5 text-low">
          <span className="h-1.5 w-1.5 rounded-full bg-low animate-pulse" />
          TN SDMA Command Operations
        </div>
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-300 font-semibold normal-case">
                {currentUser.name}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                  currentUser.role === "OFFICIAL"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                }`}
              >
                {currentUser.role === "OFFICIAL" ? "Gov Officer" : "Citizen"}
              </span>
              <button
                onClick={logout}
                className="text-red-400 hover:underline font-semibold ml-1"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => openAuthModal("citizen")}
                className="text-cyan-400 font-semibold hover:underline"
              >
                Citizen Sign In
              </button>
              <span className="text-gray-600">|</span>
              <button
                onClick={() => openAuthModal("official")}
                className="flex items-center gap-1 text-amber-400 font-semibold hover:underline"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Gov Portal</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-wide text-gray-100">{title}</h1>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={openSOSModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-red-600/30 transition-all cursor-pointer animate-pulse"
          >
            <AlertOctagon className="h-4 w-4" />
            <span>TRIGGER SOS</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-low" />
            <span className="text-gray-300 font-medium">ONLINE</span>
          </div>

          <div className="hidden md:block text-gray-500">
            Updated: <span className="text-gray-300 font-mono">{formatTime(now)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
