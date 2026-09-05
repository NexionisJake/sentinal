import {
  Radar,
  ShieldCheck,
  AlertOctagon,
  PhoneCall,
  MapPin,
  Flame,
  UserCheck,
  ArrowRight,
  Radio,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

export function LandingPage() {
  const { setActivePage, openSOSModal, openAuthModal, currentUser, logout } =
    useAppContext();

  return (
    <div className="min-h-screen bg-command-950 text-gray-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Emergency Hotlines Ticker Bar */}
      <div className="bg-red-950/80 border-b border-red-500/30 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-red-300 font-bold uppercase tracking-wider">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-white">TOLL-FREE EMERGENCY HOTLINES:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <a
            href="tel:112"
            className="flex items-center gap-1.5 font-mono text-white hover:text-red-300 transition-colors"
          >
            <PhoneCall className="h-3.5 w-3.5 text-red-400" />
            <span className="font-bold">112</span>
            <span className="text-[10px] text-gray-400 font-sans">(National)</span>
          </a>
          <a
            href="tel:1070"
            className="flex items-center gap-1.5 font-mono text-white hover:text-amber-300 transition-colors"
          >
            <PhoneCall className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-bold">1070</span>
            <span className="text-[10px] text-gray-400 font-sans">(State Control)</span>
          </a>
          <a
            href="tel:1077"
            className="flex items-center gap-1.5 font-mono text-white hover:text-cyan-300 transition-colors"
          >
            <PhoneCall className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-bold">1077</span>
            <span className="text-[10px] text-gray-400 font-sans">(District Control)</span>
          </a>
        </div>

        <button
          onClick={openSOSModal}
          className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-extrabold text-[11px] tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-md shadow-red-600/40 cursor-pointer animate-pulse"
        >
          <AlertOctagon className="h-3.5 w-3.5" />
          <span>QUICK SOS</span>
        </button>
      </div>

      {/* Main Navigation Header */}
      <header className="border-b border-command-border bg-command-900/90 backdrop-blur sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-infra/10 border border-infra/40 shadow-inner">
            <Radar className="h-6 w-6 text-infra" strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-widest text-white">
                SENTINEL-X
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-[9px] font-mono text-cyan-400 uppercase tracking-wider">
                V2.6 LIVE
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">
              Tamil Nadu State Disaster Management Authority
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setActivePage("map")}
            className="hidden sm:flex items-center gap-1.5 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg border border-command-border hover:bg-command-800 transition-colors"
          >
            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
            <span>Hazard Map (Guest)</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2 bg-command-950 border border-command-border px-3 py-1.5 rounded-lg">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white truncate max-w-[120px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-command-800 text-gray-400 uppercase">
                {currentUser.role}
              </span>
              <button
                onClick={logout}
                className="text-[10px] text-red-400 hover:underline ml-1"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal("citizen")}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal("official")}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Gov Portal</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-8 border-b border-command-border bg-gradient-to-b from-command-900 to-command-950">
        {/* Subtle background tactical grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono tracking-wider uppercase">
            <Radio className="h-3.5 w-3.5 text-red-400 animate-pulse" />
            <span>State-Wide Early Warning & Emergency Response System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            SENTINEL-X
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-400 to-red-400 mt-2">
              Integrated Disaster Situational Awareness
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Real-time geospatial radar, city vulnerability classification (Red, Orange, Yellow, Green), and direct 1-click emergency SOS dispatch connecting Tamil Nadu citizens with state response commanders.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActivePage("map")}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
            >
              <MapPin className="h-4 w-4" />
              <span>Explore Live Hazard Map (Guest)</span>
            </button>

            <button
              onClick={openSOSModal}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 animate-pulse"
            >
              <AlertOctagon className="h-4 w-4" />
              <span>Report Emergency SOS</span>
            </button>

            <button
              onClick={() => openAuthModal("official")}
              className="px-6 py-3 rounded-xl bg-command-900 hover:bg-command-800 border border-amber-500/40 text-amber-300 font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>Command Operations Portal</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Pillars Showcase */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            PLATFORM CAPABILITIES
          </h2>
          <p className="text-2xl font-bold text-white">
            Unified Emergency Response Architecture
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Geospatial Radar */}
          <div
            onClick={() => setActivePage("map")}
            className="p-6 rounded-xl bg-command-900 border border-command-border hover:border-cyan-500/60 transition-all cursor-pointer group space-y-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
              <MapPin className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                Live Geospatial Radar
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Real-time Leaflet mapping of floods, cyclones, landslides, and infrastructure facilities across 38 districts.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>View Map</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 2: City Risk Zones */}
          <div
            onClick={() => setActivePage("risk")}
            className="p-6 rounded-xl bg-command-900 border border-command-border hover:border-amber-500/60 transition-all cursor-pointer group space-y-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform">
              <Flame className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                City Risk Zone Matrix
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Tiered vulnerability classification (Red, Orange, Yellow, Green) with search, filter, and score progress meters.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Check Risk Matrix</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 3: User SOS Dispatch */}
          <div
            onClick={openSOSModal}
            className="p-6 rounded-xl bg-command-900 border border-command-border hover:border-red-500/60 transition-all cursor-pointer group space-y-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 group-hover:scale-110 transition-transform">
              <AlertOctagon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white group-hover:text-red-300 transition-colors">
                User SOS Alert System
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Automatic GPS coordinate transmission, 1-click preset messages, and immediate safety guidelines with helpline dialers.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-red-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Trigger SOS Dialog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 4: Government Operations Portal */}
          <div
            onClick={() => openAuthModal("official")}
            className="p-6 rounded-xl bg-command-900 border border-command-border hover:border-emerald-500/60 transition-all cursor-pointer group space-y-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                Government Command EOC
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Protected portal for officials to monitor live incoming caller feeds, transition alert statuses, and dispatch teams.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Official Login</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Dual Login Callout Cards */}
      <section className="py-12 px-4 sm:px-8 border-t border-command-border bg-command-900/60">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Citizen Login Box */}
          <div className="p-6 rounded-xl bg-command-950 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm uppercase tracking-wider">
                <UserCheck className="h-5 w-5 text-cyan-400" />
                <span>Citizen Sign In</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono">
                PUBLIC ACCESS
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Log in with your Mobile Number or Email to receive personalized alert notifications, bookmark emergency shelters, and track real-time incident reports.
            </p>
            <button
              onClick={() => openAuthModal("citizen")}
              className="w-full py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Access Citizen Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Official Login Box */}
          <div className="p-6 rounded-xl bg-command-950 border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm uppercase tracking-wider">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <span>Government Officer Portal</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-400 font-mono">
                RESTRICTED EOC
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Restricted portal for disaster management officers, first responders, and emergency operational commanders with real-time incident feeds.
            </p>
            <button
              onClick={() => openAuthModal("official")}
              className="w-full py-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Officer Passkey Verification</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-command-border bg-command-950 py-6 px-4 text-center text-xs text-gray-500 space-y-2">
        <p className="font-semibold text-gray-400">
          SENTINEL-X — Tamil Nadu State Disaster Management Authority (TN-SDMA)
        </p>
        <p className="text-[11px] text-gray-600 max-w-xl mx-auto">
          Operational Prototype for Emergency Preparedness & Integrated Command Operations. All data presented is simulated frontend response telemetry.
        </p>
      </footer>
    </div>
  );
}
