import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import type { Facility } from "../../types";
import { makeFacilityIcon, makeSelectedIcon } from "../../lib/mapIcons";
import { MapController } from "../map/MapController";

interface Props {
  origin: { lat: number; lng: number; label: string } | null;
  hospital?: Facility;
  police?: Facility;
  fire?: Facility;
  showHospitals: boolean;
  showPolice: boolean;
  showFire: boolean;
  focus: { lat: number; lng: number; zoom?: number } | null;
  routeTargetId?: string;
}

const routeColors: Record<string, string> = { hospital: "#38bdf8", police: "#a78bfa", fire: "#f97316" };

export function EmergencyMap({ origin, hospital, police, fire, showHospitals, showPolice, showFire, focus, routeTargetId }: Props) {
  const center: [number, number] = origin ? [origin.lat, origin.lng] : [11.0, 78.6];

  return (
    <MapContainer center={center} zoom={origin ? 12 : 7} minZoom={3} maxZoom={18} className="h-full w-full" zoomControl>
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        attribution="&copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
      />
      <MapController focus={focus} />

      {origin && (
        <Marker position={[origin.lat, origin.lng]} icon={makeSelectedIcon()}>
          <Popup autoPanPadding={[60, 60]} offset={[0, -10]}>
            <div className="p-3 text-xs bg-command-900 text-slate-100 rounded-md">
              <p className="font-semibold text-white">{origin.label}</p>
              <p className="text-slate-400 mt-1">Selected disaster location</p>
            </div>
          </Popup>
        </Marker>
      )}

      {showHospitals && hospital && (
        <>
          <Marker position={[hospital.lat, hospital.lng]} icon={makeFacilityIcon("hospital", routeTargetId === hospital.id)}>
            <Popup autoPanPadding={[60, 60]} offset={[0, -10]}>
              <div className="p-3 text-xs bg-command-900 text-slate-100 rounded-md">
                <p className="font-semibold text-white">{hospital.name}</p>
                <p className="text-slate-400 mt-1">{hospital.distanceKm.toFixed(1)} km · {hospital.travelTimeMin} min</p>
              </div>
            </Popup>
          </Marker>
          {origin && (
            <Polyline
              positions={[[origin.lat, origin.lng], [hospital.lat, hospital.lng]]}
              pathOptions={{ color: routeColors.hospital, weight: routeTargetId === hospital.id ? 4 : 2, dashArray: "6 4" }}
            />
          )}
        </>
      )}

      {showPolice && police && (
        <>
          <Marker position={[police.lat, police.lng]} icon={makeFacilityIcon("police", routeTargetId === police.id)}>
            <Popup autoPanPadding={[60, 60]} offset={[0, -10]}>
              <div className="p-3 text-xs bg-command-900 text-slate-100 rounded-md">
                <p className="font-semibold text-white">{police.name}</p>
                <p className="text-slate-400 mt-1">{police.distanceKm.toFixed(1)} km · {police.travelTimeMin} min</p>
              </div>
            </Popup>
          </Marker>
          {origin && (
            <Polyline
              positions={[[origin.lat, origin.lng], [police.lat, police.lng]]}
              pathOptions={{ color: routeColors.police, weight: routeTargetId === police.id ? 4 : 2, dashArray: "2 6" }}
            />
          )}
        </>
      )}

      {showFire && fire && (
        <>
          <Marker position={[fire.lat, fire.lng]} icon={makeFacilityIcon("fire", routeTargetId === fire.id)}>
            <Popup autoPanPadding={[60, 60]} offset={[0, -10]}>
              <div className="p-3 text-xs bg-command-900 text-slate-100 rounded-md">
                <p className="font-semibold text-white">{fire.name}</p>
                <p className="text-slate-400 mt-1">{fire.distanceKm.toFixed(1)} km · {fire.travelTimeMin} min</p>
              </div>
            </Popup>
          </Marker>
          {origin && (
            <Polyline
              positions={[[origin.lat, origin.lng], [fire.lat, fire.lng]]}
              pathOptions={{ color: routeColors.fire, weight: routeTargetId === fire.id ? 4 : 2 }}
            />
          )}
        </>
      )}
    </MapContainer>
  );
}
