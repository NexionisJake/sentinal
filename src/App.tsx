import "leaflet/dist/leaflet.css";
import { AppProvider, useAppContext } from "./context/AppContext";
import { Sidebar } from "./components/layout/Sidebar";
import { MobileNav } from "./components/layout/MobileNav";
import { LandingPage } from "./pages/LandingPage";
import { DisasterMapPage } from "./pages/DisasterMapPage";
import { EmergencyServicesPage } from "./pages/EmergencyServicesPage";
import { ActiveAlertsPage } from "./pages/ActiveAlertsPage";
import { RiskOverviewPage } from "./pages/RiskOverviewPage";
import { RelocationPage } from "./pages/RelocationPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { GovLoginPage } from "./pages/GovLoginPage";
import { GovDashboardPage } from "./pages/GovDashboardPage";
import { GovProtectedRoute } from "./components/auth/GovProtectedRoute";
import { SOSButton } from "./components/sos/SOSButton";
import { SOSModal } from "./components/sos/SOSModal";
import { AuthModal } from "./components/auth/AuthModal";

function Router() {
  const { activePage } = useAppContext();

  switch (activePage) {
    case "landing":
      return <LandingPage />;
    case "map":
      return <DisasterMapPage />;
    case "emergency":
      return <EmergencyServicesPage />;
    case "alerts":
      return <ActiveAlertsPage />;
    case "risk":
      return <RiskOverviewPage />;
    case "relocation":
      return <RelocationPage />;
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
      return <LandingPage />;
  }
}

function Shell() {
  const { activePage } = useAppContext();
  const isFullBleedPage = activePage === "landing";

  if (isFullBleedPage) {
    return (
      <div className="min-h-screen w-screen overflow-x-hidden bg-command-950 text-gray-200">
        <Router />
        <SOSButton />
        <SOSModal />
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-command-950 text-gray-200">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col pb-14 md:pb-0">
        <Router />
      </main>
      <MobileNav />
      <SOSButton />
      <SOSModal />
      <AuthModal />
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
