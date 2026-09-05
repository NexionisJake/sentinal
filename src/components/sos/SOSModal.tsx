import { useEffect, useState } from "react";
import {
  AlertOctagon,
  X,
  MapPin,
  Loader2,
  CheckCircle2,
  PhoneCall,
  ShieldAlert,
  Flame,
  Waves,
  HeartPulse,
  Building2,
  Edit3,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import type { SOSMessageType, SOSPriority } from "../../types";

const PREDEFINED_CHIPS: {
  type: SOSMessageType;
  label: string;
  presetText: string;
  icon: typeof Waves;
  priority: SOSPriority;
}[] = [
  {
    type: "TRAPPED_FLOOD",
    label: "Water Levels Rising",
    presetText: "Immediate rescue required – Water levels rising rapidly near residence.",
    icon: Waves,
    priority: "CRITICAL",
  },
  {
    type: "MEDICAL_EMERGENCY",
    label: "Medical Emergency",
    presetText: "Medical assistance needed urgently – Patient requiring critical care.",
    icon: HeartPulse,
    priority: "CRITICAL",
  },
  {
    type: "STRUCTURAL_COLLAPSE",
    label: "Trapped / Evacuation",
    presetText: "Elderly/children trapped – unable to evacuate location safely.",
    icon: Building2,
    priority: "CRITICAL",
  },
  {
    type: "FIRE_HAZARD",
    label: "Fire Hazard",
    presetText: "Fire hazard spreading rapidly in immediate area.",
    icon: Flame,
    priority: "HIGH",
  },
  {
    type: "CUSTOM",
    label: "Other Emergency",
    presetText: "",
    icon: Edit3,
    priority: "HIGH",
  },
];

const DISTRICT_LIST = [
  "Chennai",
  "Cuddalore",
  "Nagapattinam",
  "Thanjavur",
  "Tiruchirappalli",
  "Coimbatore",
  "Madurai",
  "Nilgiris",
  "Kanyakumari",
  "Tirunelveli",
];

export function SOSModal() {
  const { isSOSModalOpen, closeSOSModal, addSOSAlert } = useAppContext();

  const [selectedType, setSelectedType] = useState<SOSMessageType>("TRAPPED_FLOOD");
  const [messageText, setMessageText] = useState(PREDEFINED_CHIPS[0].presetText);
  const [senderName, setSenderName] = useState("");
  const [district, setDistrict] = useState("Chennai");

  // Geolocation state
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 13.0827, lng: 80.2707 });
  const [geoStatus, setGeoStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
  const [geoErrorMsg, setGeoErrorMsg] = useState("");

  // Confirmation view state
  const [submittedAlertId, setSubmittedAlertId] = useState<string | null>(null);

  useEffect(() => {
    if (isSOSModalOpen) {
      setSubmittedAlertId(null);
      fetchLocation();
    }
  }, [isSOSModalOpen]);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus("ERROR");
      setGeoErrorMsg("Geolocation is not supported by your browser.");
      return;
    }

    setGeoStatus("LOADING");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4)),
        });
        setGeoStatus("SUCCESS");
      },
      (err) => {
        setGeoStatus("ERROR");
        setGeoErrorMsg(err.message || "Permission denied. Using fallback coordinates.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleChipSelect = (item: (typeof PREDEFINED_CHIPS)[0]) => {
    setSelectedType(item.type);
    if (item.type !== "CUSTOM") {
      setMessageText(item.presetText);
    } else {
      setMessageText("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chip = PREDEFINED_CHIPS.find((c) => c.type === selectedType);
    const priority = chip ? chip.priority : "HIGH";

    const created = addSOSAlert({
      senderName: senderName.trim() || "Anonymous Caller",
      coordinates: coords,
      messageType: selectedType,
      messageText: messageText.trim() || chip?.presetText || "Emergency Assistance Needed",
      priority,
      district,
    });

    setSubmittedAlertId(created.id);
  };

  if (!isSOSModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-command-900 border border-red-500/40 rounded-xl shadow-2xl overflow-hidden text-gray-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-red-950/60 border-b border-red-500/30">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/30 border border-red-500/50">
              <AlertOctagon className="h-5 w-5 text-red-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-wide text-white uppercase flex items-center gap-2">
                Emergency SOS Dispatch
              </h2>
              <p className="text-[11px] text-red-300">
                Direct Alert Transmission to TN-SDMA Command Center
              </p>
            </div>
          </div>
          <button
            onClick={closeSOSModal}
            className="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-command-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {submittedAlertId ? (
            /* Confirmation Feedback View */
            <div className="space-y-4 py-2 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 border-2 border-emerald-500">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <span className="inline-block rounded bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-300 uppercase">
                  DISPATCH CONFIRMED — {submittedAlertId}
                </span>
                <h3 className="text-base font-bold text-white mt-2">
                  SOS Signal Broadcasted Successfully!
                </h3>
                <p className="text-gray-300 text-xs mt-1 max-w-sm mx-auto">
                  State Emergency Operations Center and nearest rescue units have been alerted with your coordinates.
                </p>
              </div>

              {/* Safety Instructions Card */}
              <div className="text-left rounded-lg bg-command-950 border border-command-border p-3.5 space-y-2">
                <p className="font-bold text-yellow-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <ShieldAlert className="h-4 w-4" /> Immediate Safety Guidelines:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1 text-[11px]">
                  <li>Move to higher ground if floodwaters are rising.</li>
                  <li>Keep phone battery conserved & turn off high-power background apps.</li>
                  <li>Stay calm; rescue vehicles are tracking location: <span className="font-mono text-cyan-300">{coords.lat}, {coords.lng}</span>.</li>
                </ul>
              </div>

              {/* Direct Emergency Call Hotlines */}
              <div className="pt-2">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-wider">
                  Direct Toll-Free Emergency Hotlines:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href="tel:1070"
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 hover:bg-red-900/50 transition-colors"
                  >
                    <PhoneCall className="h-4 w-4 mb-1 text-red-400" />
                    <span className="font-mono font-bold text-sm text-white">1070</span>
                    <span className="text-[9px] text-gray-400">State Control</span>
                  </a>
                  <a
                    href="tel:1077"
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 hover:bg-amber-900/50 transition-colors"
                  >
                    <PhoneCall className="h-4 w-4 mb-1 text-amber-400" />
                    <span className="font-mono font-bold text-sm text-white">1077</span>
                    <span className="text-[9px] text-gray-400">District Helpline</span>
                  </a>
                  <a
                    href="tel:112"
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50 transition-colors"
                  >
                    <PhoneCall className="h-4 w-4 mb-1 text-cyan-400" />
                    <span className="font-mono font-bold text-sm text-white">112</span>
                    <span className="text-[9px] text-gray-400">National Emergency</span>
                  </a>
                </div>
              </div>

              <button
                onClick={closeSOSModal}
                className="mt-3 w-full py-2.5 rounded-lg bg-command-800 hover:bg-command-750 text-white font-semibold text-xs border border-command-border transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            /* SOS Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* GPS Location Status Bar */}
              <div className="rounded-lg bg-command-950 border border-command-border p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-cyan-400" />
                    <span className="font-semibold text-gray-200">Caller Coordinates:</span>
                  </div>
                  {geoStatus === "LOADING" ? (
                    <span className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                      <Loader2 className="h-3 w-3 animate-spin" /> Locating...
                    </span>
                  ) : geoStatus === "SUCCESS" ? (
                    <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                      ✓ GPS Acquired
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={fetchLocation}
                      className="text-[10px] text-cyan-400 hover:underline"
                    >
                      Retry GPS
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-command-900 px-2.5 py-1.5 rounded border border-command-border text-gray-300">
                    LAT: <span className="text-white font-bold">{coords.lat}</span>
                  </div>
                  <div className="bg-command-900 px-2.5 py-1.5 rounded border border-command-border text-gray-300">
                    LNG: <span className="text-white font-bold">{coords.lng}</span>
                  </div>
                </div>

                {geoStatus === "ERROR" && (
                  <p className="text-[10px] text-amber-400 mt-1">
                    {geoErrorMsg || "Manual district location fallback active."}
                  </p>
                )}
              </div>

              {/* District & Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                    District / Region
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-md bg-command-950 border border-command-border px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    {DISTRICT_LIST.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                    Caller Name <span className="text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Anonymous"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full rounded-md bg-command-950 border border-command-border px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Quick Select Emergency Preset Chips */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1.5">
                  Select Quick Emergency Preset:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PREDEFINED_CHIPS.map((chip) => {
                    const Icon = chip.icon;
                    const isSelected = selectedType === chip.type;
                    return (
                      <button
                        key={chip.type}
                        type="button"
                        onClick={() => handleChipSelect(chip)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? "bg-red-950/60 border-red-500 text-white shadow-md shadow-red-950/50"
                            : "bg-command-950 border-command-border text-gray-300 hover:bg-command-800 hover:text-white"
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-red-400" : "text-gray-400"}`} />
                        <span className="text-[11px] font-semibold truncate">{chip.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Emergency Message Details Input */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                  Emergency Situation Details:
                </label>
                <textarea
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Describe your location landmarks, number of affected people, or specific emergency needs..."
                  className="w-full rounded-md bg-command-950 border border-command-border p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              {/* Action Submit */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeSOSModal}
                  className="px-4 py-2.5 rounded-lg border border-command-border text-gray-400 hover:text-white hover:bg-command-800 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-red-600/40 transition-all flex items-center justify-center gap-2"
                >
                  <AlertOctagon className="h-4 w-4" /> DISPATCH EMERGENCY SOS
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
