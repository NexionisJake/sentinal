import "leaflet/dist/leaflet.css";
import { AppProvider, useAppContext } from "./context/AppContext";
import { Sidebar } from "./components/layout/Sidebar";
import { MobileNav } from "./components/layout/MobileNav";
import { DisasterMapPage } from "./pages/DisasterMapPage";
import { EmergencyServicesPage } from "./pages/EmergencyServicesPage";
import { ActiveAlertsPage } from "./pages/ActiveAlertsPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { GovLoginPage } from "./pages/GovLoginPage";
import { GovDashboardPage } from "./pages/GovDashboardPage";
import { GovProtectedRoute } from "./components/auth/GovProtectedRoute";
import { SOSButton } from "./components/sos/SOSButton";
import { SOSModal } from "./components/sos/SOSModal";

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
    case "gov-login":
      return <GovLoginPage />;
    case "gov-dashboard":
      return (
        <GovProtectedRoute>
          <GovDashboardPage />
        </GovProtectedRoute>
      );
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
      <SOSButton />
      <SOSModal />
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
