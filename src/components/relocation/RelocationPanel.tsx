import { useState, useMemo } from "react";
import {
  AlertOctagon,
  Printer,
  Copy,
  Check,
  Radio,
  MapPin,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import type { ShelterFacility, ShelterType } from "../../types";
import { relocationService } from "../../services/relocationService";
import { useAppContext } from "../../context/AppContext";
import { ShelterCard } from "./ShelterCard";
import { ShelterFilters, type SortBy, type StatusFilter } from "./ShelterFilters";
import { CITY_RISK_PROFILES } from "../../data/cityRiskData";

interface Props {
  onSelectShelterForMap: (shelter: ShelterFacility) => void;
}

export function RelocationPanel({ onSelectShelterForMap }: Props) {
  const {
    userLocation,
    setUserLocation,
    acquireUserLocation,
    selectedRelocationSite,
  } = useAppContext();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | ShelterType>("ALL");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("distance");
  const [copiedState, setCopiedState] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState("city-red-1"); // Default Chennai

  // Get raw shelters list from service
  const allShelters = useMemo(() => relocationService.getAllShelters(), []);

  // Compute nearest shelters from user coordinates
  const rankedShelters = useMemo(() => {
    const coords = userLocation || { lat: 13.0827, lng: 80.2707 };
    return relocationService.getNearestSafeShelters(coords, 0, allShelters);
  }, [userLocation, allShelters]);

  // Apply filters
  const filteredShelters = useMemo(() => {
    return rankedShelters.filter((shelter) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = shelter.name.toLowerCase().includes(q);
        const matchDistrict = shelter.district?.toLowerCase().includes(q);
        if (!matchName && !matchDistrict) return false;
      }

      // Status
      if (statusFilter !== "ALL") {
        if (statusFilter === "OPEN" && shelter.status !== "OPEN") return false;
        if (
          statusFilter === "NEAR_CAPACITY" &&
          shelter.status !== "NEAR_CAPACITY" &&
          shelter.status !== "NEAR_FULL"
        )
          return false;
        if (statusFilter === "FULL" && shelter.status !== "FULL") return false;
      }

      // Type
      if (typeFilter !== "ALL" && shelter.type !== typeFilter) return false;

      // Amenities
      if (selectedAmenities.length > 0) {
        const shelterAmenityUpper = shelter.amenities.map((a) =>
          a.toUpperCase().replace(/\s+/g, "_")
        );
        const matchesAll = selectedAmenities.every((req) =>
          shelterAmenityUpper.includes(req)
        );
        if (!matchesAll) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "capacity") {
        return b.totalCapacity - a.totalCapacity;
      }
      if (sortBy === "occupancy") {
        const occA = (a.currentOccupancy / a.totalCapacity) * 100;
        const occB = (b.currentOccupancy / b.totalCapacity) * 100;
        return occB - occA;
      }
      // default: distance
      return (a.distanceKm ?? 0) - (b.distanceKm ?? 0);
    });
  }, [rankedShelters, searchQuery, statusFilter, typeFilter, selectedAmenities, sortBy]);

  // Toggle amenity selection
  const handleToggleAmenity = (key: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Change location city fallback
  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const city = CITY_RISK_PROFILES.find((c) => c.id === cityId);
    if (city) {
      setUserLocation(city.coordinates);
    }
  };

  // Copy offline info
  const handleCopyOfflineInfo = () => {
    const top5 = filteredShelters.slice(0, 3);
    const lines = [
      "=========================================",
      "SENTINEL-X EMERGENCY SHELTER RELOCATION",
      "State Disaster Emergency Helpline: 1070 / 112",
      "=========================================",
      "",
      ...top5.map(
        (s, idx) =>
          `${idx + 1}. ${s.name} (${s.district || "TN"})` +
          `\n   Capacity: ${s.currentOccupancy}/${s.totalCapacity}` +
          `\n   Status: ${s.status}` +
          `\n   Contact: ${s.contactNumber || s.contact || "1070"}` +
          `\n   Coords: ${s.coordinates.lat}, ${s.coordinates.lng}` +
          `\n   Distance: ${s.distanceKm ?? "N/A"} km (${s.estimatedTravelTime || ""})\n`
      ),
    ].join("\n");

    navigator.clipboard.writeText(lines);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2500);
  };

  // Print offline info
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 text-gray-100">
      {/* Emergency Advisory Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/90 via-command-900 to-amber-950/80 border border-red-500/50 shadow-lg space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 text-red-400 font-extrabold text-sm uppercase tracking-wider">
            <AlertOctagon className="h-5 w-5 text-red-500 animate-pulse shrink-0" />
            <span>RED-ZONE EMERGENCY EVACUATION ADVISORY</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold tracking-wider uppercase animate-pulse">
            HIGH ALERT
          </span>
        </div>

        <p className="text-xs text-gray-200 leading-relaxed">
          Citizens in high hazard inundation areas are instructed to proceed immediately to designated state relief shelters. Verify route safety status before transit.
        </p>

        {/* Location selector / Geolocation info */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-red-500/30 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-[11px] flex items-center gap-1 font-medium">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              Active Zone Base:
            </span>
            <select
              value={selectedCityId}
              onChange={(e) => handleCityChange(e.target.value)}
              className="bg-command-950 text-white font-bold border border-command-border rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-400"
            >
              {CITY_RISK_PROFILES.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} ({city.zone} Zone)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={acquireUserLocation}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Acquire GPS Location</span>
          </button>
        </div>
      </div>

      {/* Filters & Sorting */}
      <ShelterFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        selectedAmenities={selectedAmenities}
        onToggleAmenity={handleToggleAmenity}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Ranked Shelters Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
          <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span>Available Evacuation Shelters ({filteredShelters.length})</span>
        </h2>
        <span className="text-[11px] text-cyan-400 font-mono font-medium">
          Sorted by {sortBy === "distance" ? "Nearest Proximity" : sortBy}
        </span>
      </div>

      {/* Ranked List of Shelter Cards */}
      {filteredShelters.length === 0 ? (
        <div className="p-8 text-center bg-command-900 border border-command-border rounded-xl space-y-2">
          <ShieldCheck className="h-8 w-8 text-gray-500 mx-auto" />
          <p className="text-sm font-bold text-gray-300">No matching shelters found</p>
          <p className="text-xs text-gray-500">
            Try adjusting your search query or loosening your amenity filter settings.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredShelters.map((shelter) => (
            <ShelterCard
              key={shelter.id}
              shelter={shelter}
              isSelected={selectedRelocationSite?.id === shelter.id}
              onLocateOnMap={onSelectShelterForMap}
            />
          ))}
        </div>
      )}

      {/* Offline Instructions & Copy Block */}
      <div className="p-4 rounded-xl bg-command-900 border border-command-border space-y-3">
        <div className="flex items-center justify-between border-b border-command-border/60 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Printer className="h-4 w-4 text-amber-400" />
            <span>Offline Emergency Instructions</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyOfflineInfo}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-command-800 hover:bg-command-750 text-gray-200 border border-command-border text-[11px] font-semibold transition-colors cursor-pointer"
            >
              {copiedState ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-gray-400" />
                  <span>Copy Info</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-command-800 hover:bg-command-750 text-gray-200 border border-command-border text-[11px] font-semibold transition-colors cursor-pointer"
            >
              <Printer className="h-3 w-3 text-gray-400" />
              <span>Print</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-300 space-y-2 leading-relaxed font-sans">
          <p className="font-semibold text-white">Emergency Preparedness Steps:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-400 text-[11px]">
            <li>Keep emergency contacts (State Helpline: <strong className="text-white">1070</strong>, Emergency: <strong className="text-white">112</strong>) saved offline.</li>
            <li>Pack essential document pouch, bottled water, medication, and charged power bank.</li>
            <li>Follow official SDMA radio broadcasts for river surge & coastal warnings.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
