import { useEffect, useState } from "react";
import { Header } from "../components/layout/Header";
import { DisasterMap } from "../components/map/DisasterMap";
import { ActiveHazardsPanel } from "../components/map/ActiveHazardsPanel";
import { MapLayersPanel } from "../components/map/MapLayersPanel";
import { MapLegend } from "../components/map/MapLegend";
import { KpiBar } from "../components/map/KpiBar";
import { disasterService } from "../services/disasterService";
import { emergencyService } from "../services/emergencyService";
import { mapService } from "../services/mapService";
import { riskService } from "../services/riskService";
import { defaultLayerState } from "../data/mapLayers";
import { useAppContext } from "../context/AppContext";
import type {
  DisasterEvent,
  FloodZone,
  MapLayerState,
  PopulationPoint,
  RoadSegment,
  Facility,
  Severity,
  KpiSummary,
} from "../types";

export function DisasterMapPage() {
  const { selectedDisaster, setSelectedDisaster, focusRequest, requestMapFocus, setActivePage } = useAppContext();

  const [disasters, setDisasters] = useState<DisasterEvent[]>([]);
  const [floodZones, setFloodZones] = useState<FloodZone[]>([]);
  const [populationPoints, setPopulationPoints] = useState<PopulationPoint[]>([]);
  const [roads, setRoads] = useState<RoadSegment[]>([]);
  const [hospitals, setHospitals] = useState<Facility[]>([]);
  const [police, setPolice] = useState<Facility[]>([]);
  const [fire, setFire] = useState<Facility[]>([]);
  const [layers, setLayers] = useState<MapLayerState>(defaultLayerState);
  const [severityCounts, setSeverityCounts] = useState<Record<Severity, number>>({
    critical: 0,
    high: 0,
    moderate: 0,
    low: 0,
  });
  const [kpi, setKpi] = useState<KpiSummary | null>(null);

  useEffect(() => {
    disasterService.getDisasters().then(setDisasters);
    disasterService.getFloodZones().then(setFloodZones);
    disasterService.getSeverityCounts().then(setSeverityCounts);
    mapService.getPopulationPoints().then(setPopulationPoints);
    mapService.getRoads().then(setRoads);
    mapService.getDefaultLayerState().then(setLayers);
    emergencyService.getAllFacilities().then((all) => {
      setHospitals(all.filter((f) => f.type === "hospital"));
      setPolice(all.filter((f) => f.type === "police"));
      setFire(all.filter((f) => f.type === "fire"));
    });
    riskService.getKpiSummary().then(setKpi);
  }, []);

  function handleSelect(d: DisasterEvent) {
    setSelectedDisaster(d);
    requestMapFocus(d.lat, d.lng, 11);
  }

  function handleViewDetails(d: DisasterEvent) {
    setSelectedDisaster(d);
    setActivePage("emergency");
  }

  function toggleLayer(key: keyof MapLayerState) {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <Header title="SENTINEL-X" subtitle="Tamil Nadu Multi-Hazard Decision Support System" />

      <div className="relative flex-1 min-h-0">
        <DisasterMap
          disasters={disasters}
          floodZones={floodZones}
          populationPoints={populationPoints}
          roads={roads}
          hospitals={hospitals}
          police={police}
          fire={fire}
          layers={layers}
          focus={focusRequest}
          onSelectDisaster={handleSelect}
          onViewDetails={handleViewDetails}
        />

        <ActiveHazardsPanel
          disasters={disasters}
          counts={severityCounts}
          onSelect={handleSelect}
          selectedId={selectedDisaster?.id}
        />
        <MapLayersPanel layers={layers} onToggle={toggleLayer} />
        <MapLegend />

        <div className="absolute left-1/2 top-3 -translate-x-1/2 z-[500] rounded-md border border-command-border bg-command-900/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-wider text-gray-400 shadow-lg">
          Simulated / Demonstration Data
        </div>
      </div>

      <KpiBar kpi={kpi} />
    </div>
  );
}
