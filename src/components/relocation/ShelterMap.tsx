import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Polyline,
  useMap,
} from "react-leaflet";
import type { ShelterFacility, RiskZoneLevel } from "../../types";
import { makeShelterIcon } from "../../lib/mapIcons";
import { CITY_RISK_PROFILES } from "../../data/cityRiskData";
import L from "leaflet";

const TAMIL_NADU_CENTER: [number, number] = [11.0, 78.6];

const ZONE_COLOR: Record<RiskZoneLevel, string> = {
  RED: "#ef4444",
  ORANGE: "#f97316",
  YELLOW: "#eab308",
  GREEN: "#22c55e",
};

const statusLabel: Record<string, string> = {
  OPEN: "Open",
  NEAR_CAPACITY: "Near Capacity",
  NEAR_FULL: "Near Full",
  FULL: "At Capacity",
  INACCESSIBLE: "Inaccessible",
  CLOSED: "Closed",
};

interface Props {
  shelters: ShelterFacility[];
  selectedShelterId?: string | null;
  userLocation?: { lat: number; lng: number } | null;
}

const userIcon = L.divIcon({
  html: `
    <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:24px;height:24px;border-radius:9999px;background:#3b82f6;opacity:0.35;animation:pulse-ring 2s infinite;"></div>
      <div style="width:14px;height:14px;border-radius:9999px;background:#3b82f6;border:2px solid #0a0e17;box-shadow:0 0 0 3px #3b82f688;"></div>
    </div>`,
  className: "hazard-marker",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Component to dynamically adjust map view to fit selected shelter and user location
function MapRouteAdjuster({
  selectedShelter,
  userLocation,
}: {
  selectedShelter?: ShelterFacility | null;
  userLocation?: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedShelter && userLocation) {
      const bounds = L.latLngBounds([
        [userLocation.lat, userLocation.lng],
        [selectedShelter.coordinates.lat, selectedShelter.coordinates.lng],
      ]);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    } else if (selectedShelter) {
      map.setView(
        [selectedShelter.coordinates.lat, selectedShelter.coordinates.lng],
        13
      );
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 11);
    }
  }, [map, selectedShelter, userLocation]);

  return null;
}

export function ShelterMap({
  shelters,
  selectedShelterId,
  userLocation,
}: Props) {
  const redZones = CITY_RISK_PROFILES.filter(
    (c) => c.zone === "RED" || c.zone === "ORANGE"
  );
  const targetShelter = shelters.find((s) => s.id === selectedShelterId);

  return (
    <MapContainer
      center={
        userLocation
          ? [userLocation.lat, userLocation.lng]
          : TAMIL_NADU_CENTER
      }
      zoom={userLocation ? 10 : 7}
      minZoom={3}
      maxZoom={18}
      className="h-full w-full rounded-xl"
      zoomControl
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        attribution="&copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
      />

      <MapRouteAdjuster
        selectedShelter={targetShelter}
        userLocation={userLocation}
      />

      {/* Evacuation Route Polyline between User and Selected Shelter */}
      {userLocation && targetShelter && (
        <Polyline
          positions={[
            [userLocation.lat, userLocation.lng],
            [targetShelter.coordinates.lat, targetShelter.coordinates.lng],
          ]}
          pathOptions={{
            color: "#06b6d4",
            weight: 4,
            dashArray: "8 8",
            opacity: 0.9,
          }}
        />
      )}

      {/* Red/Orange zone overlays */}
      {redZones.map((city) => (
        <CircleMarker
          key={`zone-${city.id}`}
          center={[city.coordinates.lat, city.coordinates.lng]}
          radius={18}
          pathOptions={{
            color: ZONE_COLOR[city.zone],
            fillColor: ZONE_COLOR[city.zone],
            fillOpacity: 0.12,
            weight: 1,
            opacity: 0.4,
            dashArray: "4 4",
          }}
        />
      ))}

      {/* User location pin */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
          zIndexOffset={2000}
        >
          <Popup autoPanPadding={[60, 60]} offset={[0, -10]}>
            <div className="p-3 text-xs bg-command-900 text-slate-100 rounded-md">
              <p className="font-bold text-blue-400">📍 Current Location</p>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Shelter markers */}
      {shelters.map((shelter) => {
        const isSelected = shelter.id === selectedShelterId;
        return (
          <Marker
            key={shelter.id}
            position={[shelter.coordinates.lat, shelter.coordinates.lng]}
            icon={makeShelterIcon(shelter.status)}
            zIndexOffset={isSelected ? 1000 : 0}
          >
            <Popup minWidth={220} maxWidth={260} autoPanPadding={[60, 60]} offset={[0, -10]}>
              <div className="p-3 text-xs bg-command-900 text-slate-100 rounded-md space-y-2 min-w-[200px]">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-white text-sm leading-tight">
                    {shelter.name}
                  </p>
                  <span
                    className={`shrink-0 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border ${
                      shelter.status === "OPEN"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : shelter.status === "NEAR_CAPACITY" || shelter.status === "NEAR_FULL"
                        ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
                        : shelter.status === "FULL"
                        ? "bg-red-500/20 text-red-300 border-red-500/40"
                        : "bg-gray-500/20 text-gray-400 border-gray-500/40"
                    }`}
                  >
                    {statusLabel[shelter.status] || shelter.status}
                  </span>
                </div>
                {shelter.district && (
                  <p className="text-[11px] text-slate-400">{shelter.district}</p>
                )}
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>
                    Occupancy: <strong className="text-white">{shelter.currentOccupancy}/{shelter.totalCapacity}</strong>
                  </span>
                  {shelter.distanceKm != null && (
                    <span>
                      <strong className="text-cyan-400">{shelter.distanceKm} km</strong>
                    </span>
                  )}
                </div>
                {shelter.status !== "FULL" && shelter.status !== "INACCESSIBLE" && shelter.status !== "CLOSED" && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.coordinates.lat},${shelter.coordinates.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-center py-1.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition-colors"
                  >
                    🧭 Open External Directions
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
