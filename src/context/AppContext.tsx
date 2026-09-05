import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { DisasterEvent, GovUser, SOSAlert, SOSStatus, UserSession } from "../types";
import { createSOSAlert, getSOSAlerts, updateSOSAlertStatus } from "../services/sosService";

export type PageKey =
  | "landing"
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

  // Unified User & Role Auth State
  currentUser: UserSession | null;
  loginCitizen: (credentials: { emailOrPhone: string; name?: string }) => Promise<void>;
  loginOfficial: (credentials: { officialId: string; passkey: string }) => Promise<boolean>;
  logout: () => void;

  // Legacy Gov Auth Compat
  govUser: GovUser | null;
  isGovAuthenticated: boolean;
  loginGov: (email: string, pass: string) => { success: boolean; message?: string };
  logoutGov: () => void;

  // Modals
  isSOSModalOpen: boolean;
  openSOSModal: () => void;
  closeSOSModal: () => void;

  isAuthModalOpen: boolean;
  authModalDefaultTab: "citizen" | "official";
  openAuthModal: (defaultTab?: "citizen" | "official") => void;
  closeAuthModal: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const USER_SESSION_KEY = "sentinel_user_session";
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
    // Ignore audio context restrictions
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [activePage, setActivePage] = useState<PageKey>("landing");
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterEvent | null>(null);
  const [focusRequest, setFocusRequest] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [routeTarget, setRouteTarget] = useState<{ facilityId: string } | null>(null);

  // SOS state
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [latestIncomingAlert, setLatestIncomingAlert] = useState<SOSAlert | null>(null);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);

  // Unified User Session State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem(USER_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Gov User compat state
  const [govUser, setGovUser] = useState<GovUser | null>(() => {
    try {
      const stored = sessionStorage.getItem(GOV_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState<"citizen" | "official">("citizen");

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

  // Login Citizen
  const loginCitizenHandler = async (credentials: { emailOrPhone: string; name?: string }) => {
    const session: UserSession = {
      id: `citizen-${Date.now().toString().slice(-5)}`,
      name: credentials.name?.trim() || "Tamil Nadu Citizen",
      role: "CITIZEN",
      email: credentials.emailOrPhone.includes("@") ? credentials.emailOrPhone : undefined,
      phone: !credentials.emailOrPhone.includes("@") ? credentials.emailOrPhone : undefined,
    };
    setCurrentUser(session);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
    setIsAuthModalOpen(false);
    setActivePage("map");
  };

  // Login Official
  const loginOfficialHandler = async (credentials: { officialId: string; passkey: string }): Promise<boolean> => {
    const id = credentials.officialId.trim().toLowerCase();
    const pass = credentials.passkey.trim();

    if (
      (id === "officer@gov.in" || id === "officer-741" || id === "admin") &&
      (pass === "Admin@123" || pass === "SENTINEL@2026" || pass === "admin")
    ) {
      const session: UserSession = {
        id: "GOV-OFFICER-8492",
        name: "Dr. K. Vijayakumar, IAS",
        role: "OFFICIAL",
        badgeNumber: "TN-SDMA-8492",
        email: "officer@gov.in",
        department: "TN SDMA Command Center",
      };

      const gUser: GovUser = {
        id: "GOV-OFFICER-8492",
        name: "Dr. K. Vijayakumar, IAS",
        email: "officer@gov.in",
        role: "Chief Disaster Response Officer",
        department: "TN SDMA Command Center",
      };

      setCurrentUser(session);
      setGovUser(gUser);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
      sessionStorage.setItem(GOV_SESSION_KEY, JSON.stringify(gUser));
      setIsAuthModalOpen(false);
      setActivePage("gov-dashboard");
      return true;
    }
    return false;
  };

  // Unified Logout
  const logoutHandler = () => {
    setCurrentUser(null);
    setGovUser(null);
    localStorage.removeItem(USER_SESSION_KEY);
    sessionStorage.removeItem(GOV_SESSION_KEY);
    setActivePage("landing");
  };

  // Legacy Gov Login compatibility
  const loginGovHandler = (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (
      (trimmedEmail === "officer@gov.in" || trimmedEmail === "officer-741") &&
      (pass === "Admin@123" || pass === "SENTINEL@2026")
    ) {
      const user: GovUser = {
        id: "GOV-OFFICER-8492",
        name: "Dr. K. Vijayakumar, IAS",
        email: "officer@gov.in",
        role: "Chief Disaster Response Officer",
        department: "TN SDMA Command Operations",
      };
      const session: UserSession = {
        id: "GOV-OFFICER-8492",
        name: "Dr. K. Vijayakumar, IAS",
        role: "OFFICIAL",
        badgeNumber: "TN-SDMA-8492",
        email: "officer@gov.in",
        department: "TN SDMA Command Operations",
      };
      setGovUser(user);
      setCurrentUser(session);
      sessionStorage.setItem(GOV_SESSION_KEY, JSON.stringify(user));
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
      return { success: true };
    }
    return {
      success: false,
      message: "Invalid Official Credentials. Use officer@gov.in / Admin@123 or OFFICER-741 / SENTINEL@2026",
    };
  };

  const openAuthModalHandler = (defaultTab: "citizen" | "official" = "citizen") => {
    setAuthModalDefaultTab(defaultTab);
    setIsAuthModalOpen(true);
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

      currentUser,
      loginCitizen: loginCitizenHandler,
      loginOfficial: loginOfficialHandler,
      logout: logoutHandler,

      govUser,
      isGovAuthenticated: Boolean(currentUser?.role === "OFFICIAL" || govUser),
      loginGov: loginGovHandler,
      logoutGov: logoutHandler,

      isSOSModalOpen,
      openSOSModal: () => setIsSOSModalOpen(true),
      closeSOSModal: () => setIsSOSModalOpen(false),

      isAuthModalOpen,
      authModalDefaultTab,
      openAuthModal: openAuthModalHandler,
      closeAuthModal: () => setIsAuthModalOpen(false),
    }),
    [
      activePage,
      selectedDisaster,
      focusRequest,
      routeTarget,
      sosAlerts,
      latestIncomingAlert,
      currentUser,
      govUser,
      isSOSModalOpen,
      isAuthModalOpen,
      authModalDefaultTab,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
