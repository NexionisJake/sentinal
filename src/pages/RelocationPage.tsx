import { useState, useMemo } from "react";
import { Header } from "../components/layout/Header";
import { RelocationPanel } from "../components/relocation/RelocationPanel";
import { ShelterMap } from "../components/relocation/ShelterMap";
import { ShelterStats } from "../components/relocation/ShelterStats";
import { useAppContext } from "../context/AppContext";
import { relocationService } from "../services/relocationService";
import type { ShelterFacility } from "../types";
import { Map, List, Navigation } from "lucide-react";

export function RelocationPage() {
  const {
    userLocation,
    selectedRelocationSite,
    setSelectedRelocationSite,
    requestMapFocus,
  } = useAppContext();

  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  // Get all shelters with distance calculated
  const shelters = useMemo(() => {
    const coords = userLocation || { lat: 13.0827, lng: 80.2707 };
    return relocationService.getNearestSafeShelters(coords, 0);
  }, [userLocation]);

  const handleSelectShelterForMap = (shelter: ShelterFacility) => {
    setSelectedRelocationSite(shelter);
    requestMapFocus(shelter.coordinates.lat, shelter.coordinates.lng, 13);
    // Switch to map view on mobile if clicked
    setMobileView("map");
  };

  return (
    <div className="flex flex-col h-full bg-command-950 overflow-hidden text-gray-200">
      <Header
        title="🏠 Safe Relocation & Evacuation Shelter Finder"
        subtitle="Real-time relief camp matrix, capacity tracking, and direct safe route navigation for Red Zone citizens"
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {/* KPI Stats Bar */}
        <ShelterStats />

        {/* Mobile View Toggle Buttons */}
        <div className="lg:hidden flex rounded-lg bg-command-900 border border-command-border p-1">
          <button
            onClick={() => setMobileView("list")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
              mobileView === "list"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <List className="h-4 w-4" />
            <span>Shelter List</span>
          </button>
          <button
            onClick={() => setMobileView("map")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
              mobileView === "map"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Map className="h-4 w-4" />
            <span>Evacuation Map</span>
          </button>
        </div>

        {/* Desktop / Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] flex-1">
          {/* Left Column: Relocation Panel */}
          <div
            className={`lg:col-span-6 xl:col-span-5 space-y-4 ${
              mobileView === "map" ? "hidden lg:block" : "block"
            }`}
          >
            <RelocationPanel onSelectShelterForMap={handleSelectShelterForMap} />
          </div>

          {/* Right Column: Evacuation Route Map */}
          <div
            className={`lg:col-span-6 xl:col-span-7 h-[550px] lg:h-[calc(100vh-220px)] sticky top-4 rounded-xl border border-command-border overflow-hidden bg-command-900 shadow-xl flex flex-col ${
              mobileView === "list" ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Map Top Bar */}
            <div className="bg-command-900 border-b border-command-border px-4 py-2.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                  Live Evacuation Route Map
                </span>
              </div>
              {selectedRelocationSite && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400 text-[11px]">Selected:</span>
                  <span className="font-bold text-cyan-300 truncate max-w-[180px]">
                    {selectedRelocationSite.name}
                  </span>
                  <button
                    onClick={() => setSelectedRelocationSite(null)}
                    className="text-[10px] text-gray-400 hover:text-white underline ml-1"
                  >
                    Clear Route
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 relative w-full h-full">
              <ShelterMap
                shelters={shelters}
                selectedShelterId={selectedRelocationSite?.id}
                userLocation={userLocation}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
