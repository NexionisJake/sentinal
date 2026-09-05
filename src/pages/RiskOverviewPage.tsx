import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { riskService } from "../services/riskService";
import type { CityRiskProfile, RiskZoneLevel } from "../types";
import { Header } from "../components/layout/Header";
import { ZoneSummaryStats } from "../components/risk/ZoneSummaryStats";
import { CityRiskList } from "../components/risk/CityRiskList";

export function RiskOverviewPage() {
  const { setActivePage, requestMapFocus } = useAppContext();
  const [activeZoneFilter, setActiveZoneFilter] = useState<"ALL" | RiskZoneLevel>("ALL");

  const cities = riskService.getAllCityRiskProfiles();
  const stats = riskService.getZoneStats();

  const handleLocateOnMap = (city: CityRiskProfile) => {
    requestMapFocus(city.coordinates.lat, city.coordinates.lng, 12);
    setActivePage("map");
  };

  return (
    <div className="flex flex-col h-full bg-command-950 overflow-hidden text-gray-200">
      <Header
        title="📊 City Risk Zone Classification"
        subtitle="Tiered threat assessment (Red, Orange, Yellow, Green) across Tamil Nadu regions"
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* KPI Summary Banner */}
        <ZoneSummaryStats
          activeFilter={activeZoneFilter}
          onSelectFilter={(filter) => setActiveZoneFilter(filter)}
          stats={stats}
        />

        {/* City Risk List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-200">
              City Vulnerability Directory ({cities.length} Cataloged)
            </h2>
            <span className="text-[11px] text-gray-500 font-mono">
              Live Geo-Spatial Index
            </span>
          </div>

          <CityRiskList
            cities={cities}
            activeZoneFilter={activeZoneFilter}
            onSelectZoneFilter={(filter) => setActiveZoneFilter(filter)}
            onLocateOnMap={handleLocateOnMap}
          />
        </div>
      </div>
    </div>
  );
}
