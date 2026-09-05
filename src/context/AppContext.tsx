import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { DisasterEvent } from "../types";

export type PageKey = "map" | "emergency" | "alerts" | "risk" | "relocation" | "settings";

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
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activePage, setActivePage] = useState<PageKey>("map");
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterEvent | null>(null);
  const [focusRequest, setFocusRequest] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [routeTarget, setRouteTarget] = useState<{ facilityId: string } | null>(null);

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
    }),
    [activePage, selectedDisaster, focusRequest, routeTarget]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
