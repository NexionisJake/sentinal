import { Construction } from "lucide-react";
import { Header } from "../components/layout/Header";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <Header title={title} subtitle="This module is part of the full platform roadmap." />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-command-800 border border-command-border mb-4">
            <Construction className="h-6 w-6 text-gray-500" />
          </div>
          <p className="text-sm font-semibold text-gray-300">Module under development</p>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
            This section will connect to live data once the backend and AI risk-scoring services are available.
          </p>
        </div>
      </div>
    </div>
  );
}
