import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { DisasterEvent, GovUser, SOSAlert, SOSStatus } from "../types";
import { createSOSAlert, getSOSAlerts, updateSOSAlertStatus } from "../services/sosService";

export type PageKey =
  | "map"
  | "emergency"
  | "alerts"
  | "risk"
  | "relocation"
  | "settings"
  | "gov-login"
  | "gov-dashboard";

interface AppContextValue {
  activePage: PageKey;
  setActivePage: (page: PageKey) => void;
  selectedDisaster: DisasterEvent | null;
  setSelectedDisaster: (d: DisasterEvent | null) => void;
  focusRequest: { lat: number; lng: number; zoom?: number } | null;
  requestMapFocus: (lat: number, lng: number, zoom?: number) => void;
  clearFocusRequest: () => void;
  routeTarget: { facilityId: string } | null;
  requestRoute: (facilityId: string | null) => void;

  // SOS Alert State
  sosAlerts: SOSAlert[];
  addSOSAlert: (alert: Omit<SOSAlert, "id" | "timestamp" | "status">) => SOSAlert;
  updateSOSStatus: (alertId: string, status: SOSStatus) => void;
  latestIncomingAlert: SOSAlert | null;
  clearLatestIncomingAlert: () => void;

  // Gov Auth State
  govUser: GovUser | null;
  isGovAuthenticated: boolean;
  loginGov: (email: string, pass: string) => { success: boolean; message?: string };
  logoutGov: () => void;

  // SOS Modal State
  isSOSModalOpen: boolean;
  openSOSModal: () => void;
  closeSOSModal: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const GOV_SESSION_KEY = "sentinel_gov_user";

function playEmergencyBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Ignore audio context autoplay restrictions gracefully
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [activePage, setActivePage] = useState<PageKey>("map");
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterEvent | null>(null);
  const [focusRequest, setFocusRequest] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [routeTarget, setRouteTarget] = useState<{ facilityId: string } | null>(null);

  // SOS state
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [latestIncomingAlert, setLatestIncomingAlert] = useState<SOSAlert | null>(null);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);

  // Gov user state
  const [govUser, setGovUser] = useState<GovUser | null>(() => {
    try {
      const stored = sessionStorage.getItem(GOV_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setSosAlerts(getSOSAlerts());
  }, []);

  const addSOSAlertHandler = (data: Omit<SOSAlert, "id" | "timestamp" | "status">): SOSAlert => {
    const created = createSOSAlert(data);
    setSosAlerts((prev) => [created, ...prev]);
    setLatestIncomingAlert(created);
    playEmergencyBeep();
    return created;
  };

  const updateSOSStatusHandler = (alertId: string, status: SOSStatus) => {
    const updatedList = updateSOSAlertStatus(alertId, status);
    setSosAlerts(updatedList);
  };

  const loginGovHandler = (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail === "officer@gov.in" && pass === "Admin@123") {
      const user: GovUser = {
        id: "GOV-OFFICER-8492",
        name: "Dr. K. Vijayakumar, IAS",
        email: "officer@gov.in",
        role: "Chief Disaster Response Officer",
        department: "TN SDMA Command Operations",
      };
      setGovUser(user);
      sessionStorage.setItem(GOV_SESSION_KEY, JSON.stringify(user));
      return { success: true };
    }
    return {
      success: false,
      message: "Invalid Official Credentials. Please use officer@gov.in / Admin@123",
    };
  };

  const logoutGovHandler = () => {
    setGovUser(null);
    sessionStorage.removeItem(GOV_SESSION_KEY);
    if (activePage === "gov-dashboard") {
      setActivePage("map");
    }
  };

  const value = useMemo<AppContextValue>(
    () => ({
      activePage,
      setActivePage,
      selectedDisaster,
      setSelectedDisaster,
      focusRequest,
      requestMapFocus: (lat: number, lng: number, zoom?: number) => setFocusRequest({ lat, lng, zoom }),
      clearFocusRequest: () => setFocusRequest(null),
      routeTarget,
      requestRoute: (facilityId: string | null) => setRouteTarget(facilityId ? { facilityId } : null),

      sosAlerts,
      addSOSAlert: addSOSAlertHandler,
      updateSOSStatus: updateSOSStatusHandler,
      latestIncomingAlert,
      clearLatestIncomingAlert: () => setLatestIncomingAlert(null),

      govUser,
      isGovAuthenticated: Boolean(govUser),
      loginGov: loginGovHandler,
      logoutGov: logoutGovHandler,

      isSOSModalOpen,
      openSOSModal: () => setIsSOSModalOpen(true),
      closeSOSModal: () => setIsSOSModalOpen(false),
    }),
    [
      activePage,
      selectedDisaster,
      focusRequest,
      routeTarget,
      sosAlerts,
      latestIncomingAlert,
      govUser,
      isSOSModalOpen,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
