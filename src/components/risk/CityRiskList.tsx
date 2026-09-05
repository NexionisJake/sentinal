import { useState } from "react";
import { Search, Filter, AlertOctagon } from "lucide-react";
import type { CityRiskProfile, RiskZoneLevel } from "../../types";
import { CityRiskCard } from "./CityRiskCard";

interface Props {
  cities: CityRiskProfile[];
  activeZoneFilter: "ALL" | RiskZoneLevel;
  onSelectZoneFilter: (zone: "ALL" | RiskZoneLevel) => void;
  onLocateOnMap: (city: CityRiskProfile) => void;
}

export function CityRiskList({
  cities,
  activeZoneFilter,
  onSelectZoneFilter,
  onLocateOnMap,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.primaryThreat.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesZone =
      activeZoneFilter === "ALL" ? true : city.zone === activeZoneFilter;

    return matchesSearch && matchesZone;
  });

  return (
    <div className="space-y-4">
      {/* Search Bar & Zone Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-command-900 p-3.5 rounded-xl border border-command-border">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search city, district, threat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-command-950 border border-command-border pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Zone Selector Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs shrink-0 py-1 sm:py-0">
          <Filter className="h-4 w-4 text-gray-500 shrink-0 mr-1" />
          {(
            [
              { key: "ALL", label: "All" },
              { key: "RED", label: "Red Zone" },
              { key: "ORANGE", label: "Orange Zone" },
              { key: "YELLOW", label: "Yellow Zone" },
              { key: "GREEN", label: "Green Zone" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => onSelectZoneFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                activeZoneFilter === tab.key
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-gray-400 hover:bg-command-800 hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {filteredCities.length === 0 ? (
        <div className="p-12 text-center bg-command-900/40 rounded-xl border border-command-border space-y-2">
          <AlertOctagon className="h-8 w-8 mx-auto text-gray-500" />
          <p className="text-sm font-semibold text-gray-300">No Risk Profiles Found</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            No cities match search term "{searchTerm}" with filter "{activeZoneFilter}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCities.map((city) => (
            <CityRiskCard key={city.id} city={city} onLocateOnMap={onLocateOnMap} />
          ))}
        </div>
      )}
    </div>
  );
}
