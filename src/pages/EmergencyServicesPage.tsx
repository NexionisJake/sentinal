import { useEffect, useMemo, useState } from "react";
import { Crosshair } from "lucide-react";
import { Header } from "../components/layout/Header";
import { ServiceCard } from "../components/emergency/ServiceCard";
import { EmergencyMap } from "../components/emergency/EmergencyMap";
import { FacilitiesTable } from "../components/emergency/FacilitiesTable";
import { emergencyService } from "../services/emergencyService";
import { districts } from "../data/disasters";
import { useAppContext } from "../context/AppContext";
import type { Facility, FacilityType } from "../types";

const LOCATION_OPTIONS = ["Chennai", "Cuddalore", "Nagapattinam", "Thanjavur", "Nilgiris", "Coimbatore", "Madurai", "Tiruchirappalli"];

const DEFAULT_FILTERS: Record<FacilityType, boolean> = {
  hospital: true,
  police: true,
  fire: true,
  ambulance: true,
  shelter: true,
};

export function EmergencyServicesPage() {
  const { selectedDisaster, requestMapFocus, focusRequest, routeTarget, requestRoute } = useAppContext();

  const [selectedDistrict, setSelectedDistrict] = useState<string>(selectedDisaster?.district ?? "Chennai");
  const [hospital, setHospital] = useState<Facility | undefined>();
  const [police, setPolice] = useState<Facility | undefined>();
  const [fire, setFire] = useState<Facility | undefined>();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    if (selectedDisaster) setSelectedDistrict(selectedDisaster.district);
  }, [selectedDisaster]);

  useEffect(() => {
    emergencyService.getNearestHospital(selectedDistrict).then(setHospital);
    emergencyService.getNearestPolice(selectedDistrict).then(setPolice);
    emergencyService.getNearestFire(selectedDistrict).then(setFire);
  }, [selectedDistrict]);

  const origin = useMemo(() => {
    if (selectedDisaster && selectedDisaster.district === selectedDistrict) {
      return { lat: selectedDisaster.lat, lng: selectedDisaster.lng, label: `${selectedDisaster.district} — Selected Disaster` };
    }
    const d = districts.find((dist) => dist.name === selectedDistrict);
    return d ? { lat: d.lat, lng: d.lng, label: `${d.name} — Affected Location` } : null;
  }, [selectedDisaster, selectedDistrict]);

  function useMapLocation() {
    if (selectedDisaster) setSelectedDistrict(selectedDisaster.district);
  }

  function viewOnMap(facility?: Facility) {
    if (!facility) return;
    requestMapFocus(facility.lat, facility.lng, 13);
  }

  function toggleFilter(type: FacilityType) {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  }

  const facilities = [hospital, police, fire].filter((f): f is Facility => Boolean(f));

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      <Header title="Emergency Services Locator" subtitle="Find critical emergency infrastructure near an affected location." />

      <div className="px-4 sm:px-6 py-4 flex flex-wrap items-end gap-3 border-b border-command-border bg-command-900">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Select affected location</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="rounded-md border border-command-border bg-command-800 px-3 py-2 text-sm text-gray-100 min-w-[220px] focus:outline-none focus:ring-1 focus:ring-infra"
          >
            {LOCATION_OPTIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={useMapLocation}
          disabled={!selectedDisaster}
          className="flex items-center gap-1.5 rounded-md border border-infra/40 bg-infra/10 px-3 py-2 text-xs font-semibold text-infra hover:bg-infra/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Crosshair className="h-3.5 w-3.5" /> USE SELECTED MAP LOCATION
        </button>

        {selectedDisaster && (
          <span className="text-[11px] text-gray-500">
            Selected on map: <span className="text-gray-300 font-medium">{selectedDisaster.district}</span> ({selectedDisaster.type})
          </span>
        )}
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hospital && (
            <ServiceCard
              facility={hospital}
              onViewOnMap={() => viewOnMap(hospital)}
              onRoute={() => requestRoute(hospital.id)}
            />
          )}
          {police && (
            <ServiceCard facility={police} onViewOnMap={() => viewOnMap(police)} onRoute={() => requestRoute(police.id)} />
          )}
          {fire && <ServiceCard facility={fire} onViewOnMap={() => viewOnMap(fire)} onRoute={() => requestRoute(fire.id)} />}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Service Filters</p>
            {(["hospital", "police", "fire", "ambulance", "shelter"] as FacilityType[]).map((type) => (
              <label key={type} className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer capitalize">
                <input
                  type="checkbox"
                  checked={filters[type]}
                  onChange={() => toggleFilter(type)}
                  className="h-3.5 w-3.5 rounded border-command-500 bg-command-800 accent-infra"
                />
                {type}
              </label>
            ))}
          </div>

          <div className="h-[420px] rounded-lg border border-command-border overflow-hidden relative">
            <EmergencyMap
              origin={origin}
              hospital={hospital}
              police={police}
              fire={fire}
              showHospitals={filters.hospital}
              showPolice={filters.police}
              showFire={filters.fire}
              focus={focusRequest}
              routeTargetId={routeTarget?.facilityId}
            />
          </div>
        </div>

        <FacilitiesTable facilities={facilities} />
      </div>
    </div>
  );
}
