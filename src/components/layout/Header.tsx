import { useEffect, useState } from "react";

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function Header({ title, subtitle }: { title: string; subtitle: string }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="border-b border-command-border bg-command-900/80 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-2 text-[10px] uppercase tracking-wider bg-command-950 border-b border-command-border">
        <div className="flex items-center gap-1.5 text-low">
          <span className="h-1.5 w-1.5 rounded-full bg-low animate-pulse" />
          Demonstration Mode
        </div>
        <p className="hidden sm:block text-gray-500 normal-case tracking-normal truncate">
          All disaster and infrastructure information shown is simulated frontend data.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-wide text-gray-100">{title}</h1>
          <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-low" />
            <span className="text-gray-300 font-medium">ONLINE</span>
          </div>
          <div className="hidden sm:block text-gray-500">
            Last Updated: <span className="text-gray-300 font-mono">{formatTime(now)}</span>
          </div>
          <div className="rounded border border-command-border bg-command-800 px-2 py-1 text-[10px] font-semibold tracking-wider text-gray-400">
            MOCK DATA
          </div>
        </div>
      </div>
    </header>
  );
}
