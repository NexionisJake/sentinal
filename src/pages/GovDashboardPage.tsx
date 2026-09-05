import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  ShieldCheck,
  AlertOctagon,
  Radio,
  Clock,
  MapPin,
  CheckCircle2,
  Send,
  Bell,
  X,
  UserCheck,
  Filter,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import type { SOSAlert, SOSStatus } from "../types";

// Helper map focus controller
function MapFlyController({ focus }: { focus: { lat: number; lng: number } | null }) {
  const map = useMap();
  if (focus) {
    map.flyTo([focus.lat, focus.lng], 13, { duration: 1.2 });
  }
  return null;
}

function makeSosMarkerIcon(status: SOSStatus) {
  let color = "#ef4444"; // red for pending
  let pulse = true;

  if (status === "ACKNOWLEDGED") {
    color = "#f97316";
    pulse = true;
  } else if (status === "DISPATCHED") {
    color = "#38bdf8";
    pulse = false;
  } else if (status === "RESOLVED") {
    color = "#22c55e";
    pulse = false;
  }

  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      ${
        pulse
          ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${color}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
          : ""
      }
      <div style="width: 24px; height: 24px; border-radius: 50%; background: ${color}; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff;"></span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "sos-custom-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

const STATUS_BADGE: Record<SOSStatus, { label: string; class: string }> = {
  PENDING: { label: "Pending Review", class: "bg-red-500/20 border-red-500/50 text-red-300 animate-pulse" },
  ACKNOWLEDGED: { label: "Acknowledged", class: "bg-amber-500/20 border-amber-500/50 text-amber-300" },
  DISPATCHED: { label: "Team Dispatched", class: "bg-cyan-500/20 border-cyan-500/50 text-cyan-300" },
  RESOLVED: { label: "Resolved", class: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" },
};

const PRIORITY_BADGE: Record<string, string> = {
  CRITICAL: "bg-red-600 text-white font-extrabold",
  HIGH: "bg-amber-500 text-slate-950 font-bold",
  MEDIUM: "bg-blue-500 text-white font-semibold",
};

export function GovDashboardPage() {
  const {
    govUser,
    logoutGov,
    sosAlerts,
    updateSOSStatus,
    latestIncomingAlert,
    clearLatestIncomingAlert,
  } = useAppContext();

  const [selectedAlert, setSelectedAlert] = useState<SOSAlert | null>(
    sosAlerts.length > 0 ? sosAlerts[0] : null
  );
  const [statusFilter, setStatusFilter] = useState<"ALL" | SOSStatus>("ALL");
  const [mapFocus, setMapFocus] = useState<{ lat: number; lng: number } | null>(
    selectedAlert ? selectedAlert.coordinates : { lat: 11.0, lng: 78.6 }
  );

  const filteredAlerts = sosAlerts.filter((item) =>
    statusFilter === "ALL" ? true : item.status === statusFilter
  );

  const pendingCount = sosAlerts.filter((a) => a.status === "PENDING").length;
  const ackCount = sosAlerts.filter((a) => a.status === "ACKNOWLEDGED").length;
  const dispatchedCount = sosAlerts.filter((a) => a.status === "DISPATCHED").length;
  const resolvedCount = sosAlerts.filter((a) => a.status === "RESOLVED").length;

  const handleSelectAlert = (alert: SOSAlert) => {
    setSelectedAlert(alert);
    setMapFocus(alert.coordinates);
  };

  const handleStatusChange = (alertId: string, newStatus: SOSStatus) => {
    updateSOSStatus(alertId, newStatus);
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert({ ...selectedAlert, status: newStatus });
    }
  };

  return (
    <div className="flex flex-col h-full bg-command-950 overflow-hidden text-gray-200">
      {/* Top Officer Header */}
      <div className="border-b border-command-border bg-command-900 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-wider uppercase">
                SDMA Emergency Operations Center
              </h1>
              <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-[10px] font-mono text-red-300 uppercase">
                RESTRICTED LIVE FEED
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Logged in as: <span className="text-gray-200 font-semibold">{govUser?.name || "Officer"}</span> ({govUser?.email || "officer@gov.in"})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-command-950 border border-command-border text-xs">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span className="text-gray-300 font-mono">ENCRYPTED GOV CANAL</span>
          </div>
          <button
            onClick={logoutGov}
            className="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-750 border border-command-border text-xs text-gray-300 hover:text-white transition-colors"
          >
            Logout Officer
          </button>
        </div>
      </div>

      {/* Banner for New Incoming SOS */}
      {latestIncomingAlert && (
        <div className="bg-red-950 border-b border-red-500/50 px-4 py-2.5 flex items-center justify-between gap-3 text-xs animate-bounce shrink-0">
          <div className="flex items-center gap-2 text-white font-bold">
            <Bell className="h-4 w-4 text-red-400 animate-spin" />
            <span>CRITICAL NEW SOS ALERT RECEIVED!</span>
            <span className="font-mono text-red-200">
              [{latestIncomingAlert.district || "Location"} — {latestIncomingAlert.messageType}]
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handleSelectAlert(latestIncomingAlert);
                clearLatestIncomingAlert();
              }}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[11px]"
            >
              View Alert Immediately
            </button>
            <button
              onClick={clearLatestIncomingAlert}
              className="text-red-400 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Operations Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-command-border">
        {/* Left Column: Live Alert Feed Drawer (5 cols) */}
        <div className="lg:col-span-5 flex flex-col min-h-0 bg-command-900/60">
          {/* Summary KPIs */}
          <div className="p-3 border-b border-command-border grid grid-cols-5 gap-1.5 text-center bg-command-950 shrink-0">
            <div className="p-2 rounded bg-command-900 border border-command-border">
              <p className="text-[9px] text-gray-400 uppercase">Total</p>
              <p className="font-mono text-sm font-bold text-white">{sosAlerts.length}</p>
            </div>
            <div className="p-2 rounded bg-red-950/40 border border-red-500/30">
              <p className="text-[9px] text-red-300 uppercase">Pending</p>
              <p className="font-mono text-sm font-bold text-red-400">{pendingCount}</p>
            </div>
            <div className="p-2 rounded bg-amber-950/40 border border-amber-500/30">
              <p className="text-[9px] text-amber-300 uppercase">Ack</p>
              <p className="font-mono text-sm font-bold text-amber-400">{ackCount}</p>
            </div>
            <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30">
              <p className="text-[9px] text-cyan-300 uppercase">Active</p>
              <p className="font-mono text-sm font-bold text-cyan-400">{dispatchedCount}</p>
            </div>
            <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30">
              <p className="text-[9px] text-emerald-300 uppercase">Resolved</p>
              <p className="font-mono text-sm font-bold text-emerald-400">{resolvedCount}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-3 py-2 border-b border-command-border flex items-center gap-1 overflow-x-auto text-[11px] shrink-0 bg-command-900">
            <Filter className="h-3.5 w-3.5 text-gray-500 shrink-0 mr-1" />
            {(["ALL", "PENDING", "ACKNOWLEDGED", "DISPATCHED", "RESOLVED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  statusFilter === tab
                    ? "bg-infra/20 text-infra font-bold border border-infra/40"
                    : "text-gray-400 hover:bg-command-800 hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* SOS List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs">
                No SOS alerts matching filter status.
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isSelected = selectedAlert?.id === alert.id;
                const statusInfo = STATUS_BADGE[alert.status];
                return (
                  <div
                    key={alert.id}
                    onClick={() => handleSelectAlert(alert)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-command-800 border-infra shadow-lg shadow-command-950/80"
                        : "bg-command-950 border-command-border hover:border-gray-700 hover:bg-command-900"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                            PRIORITY_BADGE[alert.priority]
                          }`}
                        >
                          {alert.priority}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${statusInfo.class}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.timestamp).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-white mt-2 leading-snug">
                      {alert.messageText}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-400 border-t border-command-border/60 pt-2">
                      <span className="flex items-center gap-1 text-gray-300">
                        <UserCheck className="h-3.5 w-3.5 text-infra" /> {alert.senderName || "Anonymous"}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-cyan-300">
                        <MapPin className="h-3.5 w-3.5" /> {alert.district || "TN Region"} ({alert.coordinates.lat}, {alert.coordinates.lng})
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Map & Incident Detail Panel (7 cols) */}
        <div className="lg:col-span-7 flex flex-col min-h-0 bg-command-950">
          {/* Incident Detail Bar */}
          {selectedAlert && (
            <div className="p-4 border-b border-command-border bg-command-900 space-y-3 shrink-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="h-5 w-5 text-red-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Incident Control Panel — <span className="font-mono text-cyan-300">{selectedAlert.id}</span>
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {selectedAlert.status === "PENDING" && (
                    <button
                      onClick={() => handleStatusChange(selectedAlert.id, "ACKNOWLEDGED")}
                      className="px-3 py-1.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Acknowledge Alert
                    </button>
                  )}
                  {selectedAlert.status === "ACKNOWLEDGED" && (
                    <button
                      onClick={() => handleStatusChange(selectedAlert.id, "DISPATCHED")}
                      className="px-3 py-1.5 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-bold transition-colors flex items-center gap-1"
                    >
                      <Send className="h-3.5 w-3.5" /> Dispatch Rescue Team
                    </button>
                  )}
                  {selectedAlert.status === "DISPATCHED" && (
                    <button
                      onClick={() => handleStatusChange(selectedAlert.id, "RESOLVED")}
                      className="px-3 py-1.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 font-bold transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Mark Incident Resolved
                    </button>
                  )}
                  {selectedAlert.status === "RESOLVED" && (
                    <span className="px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Resolved
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="bg-command-950 p-2 rounded border border-command-border">
                  <p className="text-[10px] text-gray-500 font-sans">CALLER</p>
                  <p className="text-white truncate">{selectedAlert.senderName || "Anonymous"}</p>
                </div>
                <div className="bg-command-950 p-2 rounded border border-command-border">
                  <p className="text-[10px] text-gray-500 font-sans">COORDINATES</p>
                  <p className="text-cyan-300">{selectedAlert.coordinates.lat}, {selectedAlert.coordinates.lng}</p>
                </div>
                <div className="bg-command-950 p-2 rounded border border-command-border">
                  <p className="text-[10px] text-gray-500 font-sans">CATEGORY</p>
                  <p className="text-amber-400">{selectedAlert.messageType}</p>
                </div>
                <div className="bg-command-950 p-2 rounded border border-command-border">
                  <p className="text-[10px] text-gray-500 font-sans">DISTRICT</p>
                  <p className="text-emerald-400">{selectedAlert.district || "Tamil Nadu"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Leaflet Incident Map */}
          <div className="flex-1 relative min-h-[350px]">
            <MapContainer
              center={[11.0, 78.6]}
              zoom={7}
              minZoom={4}
              maxZoom={18}
              className="h-full w-full"
              zoomControl
            >
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                attribution="&copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
              />
              <MapFlyController focus={mapFocus} />

              {sosAlerts.map((alert) => (
                <Marker
                  key={alert.id}
                  position={[alert.coordinates.lat, alert.coordinates.lng]}
                  icon={makeSosMarkerIcon(alert.status)}
                  eventHandlers={{ click: () => handleSelectAlert(alert) }}
                >
                  <Popup autoPanPadding={[60, 60]} offset={[0, -10]}>
                    <div className="p-3 text-xs bg-command-900 text-slate-100 rounded-md space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-red-400 font-mono">{alert.id}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-600 text-white font-bold">
                          {alert.priority}
                        </span>
                      </div>
                      <p className="font-semibold text-white leading-snug">{alert.messageText}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Caller: {alert.senderName || "Anonymous"} · {alert.coordinates.lat}, {alert.coordinates.lng}
                      </p>
                      <p className="text-[10px] text-cyan-300 font-semibold">
                        Status: {alert.status}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
