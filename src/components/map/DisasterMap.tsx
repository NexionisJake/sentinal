import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, CircleMarker } from "react-leaflet";
import type { DisasterEvent, FloodZone, MapLayerState, PopulationPoint, RoadSegment, Facility, RiskZoneLevel } from "../../types";
import { makeHazardIcon, makeFacilityIcon, makeShelterIcon } from "../../lib/mapIcons";
import { HazardPopupCard } from "./HazardPopupCard";
import { MapController } from "./MapController";
import { CITY_RISK_PROFILES } from "../../data/cityRiskData";
import { useAppContext } from "../../context/AppContext";
import { relocationService } from "../../services/relocationService";

const TAMIL_NADU_CENTER: [number, number] = [11.0, 78.6];

const densityRadius: Record<PopulationPoint["density"], number> = { high: 22, medium: 14, low: 8 };
const densityColor: Record<PopulationPoint["density"], string> = { high: "#ef4444", medium: "#f97316", low: "#38bdf8" };

const ZONE_COLOR: Record<RiskZoneLevel, string> = {
  RED: "#ef4444",
  ORANGE: "#f97316",
  YELLOW: "#eab308",
  GREEN: "#22c55e",
};

const ZONE_RADIUS: Record<RiskZoneLevel, number> = {
  RED: 20,
  ORANGE: 16,
  YELLOW: 13,
  GREEN: 10,
};

interface Props {
  disasters: DisasterEvent[];
  floodZones: FloodZone[];
  populationPoints: PopulationPoint[];
  roads: RoadSegment[];
  hospitals: Facility[];
  police: Facility[];
  fire: Facility[];
  layers: MapLayerState;
  focus: { lat: number; lng: number; zoom?: number } | null;
  onSelectDisaster: (d: DisasterEvent) => void;
  onViewDetails: (d: DisasterEvent) => void;
}

export function DisasterMap({
  disasters,
  floodZones,
  populationPoints,
  roads,
  hospitals,
  police,
  fire,
  layers,
  focus,
  onSelectDisaster,
  onViewDetails,
}: Props) {
  const { selectedRelocationSite, userLocation, setActivePage } = useAppContext();
  return (
    <MapContainer
      center={TAMIL_NADU_CENTER}
      zoom={7}
      minZoom={3}
      maxZoom={18}
      className="h-full w-full"
      zoomControl
      attributionControl
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        attribution="&copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
      />

      <MapController focus={focus} />

      {layers.floodZones &&
        floodZones.map((fz) => (
          <Polygon
            key={fz.id}
            positions={fz.coordinates}
            pathOptions={{ color: "#38bdf8", weight: 1.5, fillColor: "#38bdf8", fillOpacity: 0.18 }}
          />
        ))}

      {layers.roads &&
        roads.map((r) => (
          <Polyline key={r.id} positions={r.coordinates} pathOptions={{ color: "#4b5563", weight: 2, dashArray: "4 4" }} />
        ))}

      {layers.cityRiskZones !== false &&
        CITY_RISK_PROFILES.map((city) => (
          <CircleMarker
            key={city.id}
            center={[city.coordinates.lat, city.coordinates.lng]}
            radius={ZONE_RADIUS[city.zone]}
            pathOptions={{
              color: ZONE_COLOR[city.zone],
              fillColor: ZONE_COLOR[city.zone],
              fillOpacity: 0.25,
              weight: 2,
              opacity: 0.8,
            }}
          >
            <Popup autoPanPadding={[60, 60]} offset={[0, -10]}>
              <div className="p-3 text-xs bg-command-900 text-slate-100 rounded-md space-y-1.5 min-w-[200px]">
                <div className="flex items-center justify-between gap-2 border-b border-command-border/60 pb-1.5">
                  <p className="font-bold text-white text-sm">{city.name}</p>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      city.zone === "RED"
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : city.zone === "ORANGE"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : city.zone === "YELLOW"
                        ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    {city.zone} ZONE
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Threat: <strong className="text-amber-400">{city.primaryThreat}</strong>
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                  <span>Risk Score: <strong className="text-white">{city.riskScore}/100</strong></span>
                  <span>Alerts: <strong className="text-red-400">{city.activeAlertCount}</strong></span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

      {layers.populationDensity &&
        populationPoints.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={densityRadius[p.density]}
            pathOptions={{
              color: densityColor[p.density],
              fillColor: densityColor[p.density],
              fillOpacity: 0.15,
              weight: 1,
              opacity: 0.5,
            }}
          />
        ))}

      {layers.disasterLocations &&
        disasters
          .filter((d) => {
            if (d.type === "cyclone" && !layers.cycloneZones) return false;
            if (d.type === "landslide" && !layers.landslideZones) return false;
            return true;
          })
          .map((d) => (
            <Marker
              key={d.id}
              position={[d.lat, d.lng]}
              icon={makeHazardIcon(d.type, d.severity)}
              eventHandlers={{ click: () => onSelectDisaster(d) }}
            >
              <Popup minWidth={270} maxWidth={290} autoPanPadding={[60, 60]} offset={[0, -10]}>
                <HazardPopupCard disaster={d} onViewDetails={() => onViewDetails(d)} />
              </Popup>
            </Marker>
          ))}

      {layers.hospitals &&
        hospitals.map((h) => (
          <Marker key={h.id} position={[h.lat, h.lng]} icon={makeFacilityIcon("hospital")}>
            <Popup autoPanPadding={[60, 60]} offset={[0, -10]}>
              <div className="p-3 text-xs bg-command-900 text-slate-100 rounded-md">
                <p className="font-semibold text-white">{h.name}</p>
                <p className="text-slate-400 mt-1">Hospital · <span className="text-emerald-400 capitalize">{h.status}</span></p>
              </div>
            </Popup>
          </Marker>
        ))}

      {layers.police &&
        police.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={makeFacilityIcon("police")}>
            <Popup autoPanPadding={[60, 60]} offset={[0, -10]}>
              <div className="p-3 text-xs bg-command-900 text-slate-100 rounded-md">
                <p className="font-semibold text-white">{p.name}</p>
                <p className="text-slate-400 mt-1">Police Station · <span className="text-emerald-400 capitalize">{p.status}</span></p>
              </div>
            </Popup>
          </Marker>
        ))}

      {layers.fire &&
        fire.map((f) => (
          <Marker key={f.id} position={[f.lat, f.lng]} icon={makeFacilityIcon("fire")}>
            <Popup autoPanPadding={[60, 60]} offset={[0, -10]}>
              <div className="p-3 text-xs bg-command-900 text-slate-100 rounded-md">
                <p className="font-semibold text-white">{f.name}</p>
                <p className="text-slate-400 mt-1">Fire Station · <span className="text-emerald-400 capitalize">{f.status}</span></p>
              </div>
            </Popup>
          </Marker>
        ))}

      {(layers.safeRelocationSites || selectedRelocationSite) &&
        relocationService.getAllShelters().map((shelter) => {
          const isSelected = selectedRelocationSite?.id === shelter.id;
          return (
            <Marker
              key={shelter.id}
              position={[shelter.coordinates.lat, shelter.coordinates.lng]}
              icon={makeShelterIcon(shelter.status)}
              zIndexOffset={isSelected ? 1000 : 0}
            >
              <Popup autoPanPadding={[60, 60]} offset={[0, -10]}>
                <div className="p-3 text-xs bg-command-900 text-slate-100 rounded-md space-y-1.5 min-w-[200px]">
                  <p className="font-bold text-white text-sm">{shelter.name}</p>
                  <p className="text-slate-400">{shelter.district} · {shelter.type}</p>
                  <p className="text-[10px] font-mono text-emerald-400">
                    Spots Available: {shelter.totalCapacity - shelter.currentOccupancy} / {shelter.totalCapacity}
                  </p>
                  <button
                    onClick={() => setActivePage("relocation")}
                    className="w-full mt-2 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-[10px] cursor-pointer"
                  >
                    Open Relocation Finder
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

      {userLocation && selectedRelocationSite && (
        <Polyline
          positions={[
            [userLocation.lat, userLocation.lng],
            [selectedRelocationSite.coordinates.lat, selectedRelocationSite.coordinates.lng],
          ]}
          pathOptions={{ color: "#06b6d4", weight: 3.5, dashArray: "6 6", opacity: 0.9 }}
        />
      )}
    </MapContainer>
  );
}
