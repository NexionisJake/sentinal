# SENTINEL-X — Tamil Nadu Multi-Hazard GIS Dashboard (Frontend Prototype)

A frontend-only prototype of a State Disaster Management Command Dashboard for Tamil Nadu.
All data is **simulated / demonstration data** — there is no backend, database, or live feed.

## Tech stack

- React 19 + TypeScript
- Tailwind CSS v4
- React-Leaflet / Leaflet (interactive maps, CARTO dark basemap tiles)
- Lucide React (icons)
- Recharts (installed, ready for the Risk Overview module)
- Vite

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## What's implemented

- **Disaster Map** — interactive Tamil Nadu map with hazard markers (flood, cyclone,
  landslide, forest fire), severity rings, click-to-view popups, a collapsible
  "Active Hazards" panel, a "Map Layers" control (flood zones, population density,
  roads, hospitals/police/fire, etc.), a legend, and a bottom KPI bar.
- **Emergency Services** — pick or inherit a selected disaster location and see the
  nearest hospital, police station, and fire station, each with a mini map showing
  routes, service-type filters, and a facilities table.
- **Active Alerts** — a severity-filterable feed of simulated alerts that can jump
  back to the map, focused on that disaster.
- **Risk Overview / Relocation / Settings** — placeholder pages ("Module under
  development"), reserved for future backend integration.

Selecting a disaster on the map carries through to Emergency Services and Active
Alerts via shared app state (`src/context/AppContext.tsx`), so the experience feels
like one connected system rather than disconnected pages.

## Project structure

```
src/
  types/            Shared TypeScript interfaces
  data/             Mock "API response" data (disasters, hospitals, police, fire,
                     villages, safe sites, roads, map layers)
  services/         Thin async wrappers around the mock data, written as if they
                     were calling a real backend (disasterService, emergencyService,
                     mapService, riskService) -- swap the internals for fetch() calls
                     to FastAPI endpoints later without touching any UI code
  context/          AppContext -- cross-page selected-location / map-focus state
  lib/              Hazard/severity style helpers, Leaflet marker icon factories
  components/
    layout/         Sidebar, mobile bottom nav, top header
    map/            DisasterMap, panels, legend, KPI bar, popup card
    emergency/      Service cards, emergency map, facilities table
    alerts/         Alert card
  pages/            DisasterMapPage, EmergencyServicesPage, ActiveAlertsPage,
                     PlaceholderPage
```

## Wiring up a real backend later

Each function in `src/services/*.ts` is already shaped like an API call
(`getDisasters()`, `getNearestHospital(district)`, `getDefaultLayerState()`, etc.).
To go live, replace the mock-data lookups inside those functions with `fetch()`
calls to the corresponding endpoints (e.g. `GET /api/disasters`,
`GET /api/hospitals/nearest`, `GET /api/map/layers`) -- the page components only
ever call the service layer, so no UI changes should be required.
