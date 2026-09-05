import "leaflet/dist/leaflet.css";
import { AppProvider, useAppContext } from "./context/AppContext";
import { Sidebar } from "./components/layout/Sidebar";
import { MobileNav } from "./components/layout/MobileNav";
import { DisasterMapPage } from "./pages/DisasterMapPage";
import { EmergencyServicesPage } from "./pages/EmergencyServicesPage";
import { ActiveAlertsPage } from "./pages/ActiveAlertsPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";

function Router() {
  const { activePage } = useAppContext();

  switch (activePage) {
    case "map":
      return <DisasterMapPage />;
    case "emergency":
      return <EmergencyServicesPage />;
    case "alerts":
      return <ActiveAlertsPage />;
    case "risk":
      return <PlaceholderPage title="📊 Risk Overview" />;
    case "relocation":
      return <PlaceholderPage title="🏠 Relocation" />;
    case "settings":
      return <PlaceholderPage title="⚙️ Settings" />;
    default:
      return <DisasterMapPage />;
  }
}

function Shell() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-command-950 text-gray-200">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col pb-14 md:pb-0">
        <Router />
      </main>
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
