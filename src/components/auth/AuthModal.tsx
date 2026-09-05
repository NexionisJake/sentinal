import { useState, useEffect } from "react";
import {
  X,
  UserCheck,
  ShieldCheck,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalDefaultTab,
    loginCitizen,
    loginOfficial,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<"citizen" | "official">(
    authModalDefaultTab
  );

  // Citizen Form state
  const [citizenEmailOrPhone, setCitizenEmailOrPhone] = useState("");
  const [citizenName, setCitizenName] = useState("");

  // Official Form state
  const [officialId, setOfficialId] = useState("");
  const [officialPasskey, setOfficialPasskey] = useState("");

  // Common UI State
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalDefaultTab);
      setErrorMsg("");
      setIsLoading(false);
    }
  }, [isAuthModalOpen, authModalDefaultTab]);

  if (!isAuthModalOpen) return null;

  const handleCitizenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenEmailOrPhone.trim()) {
      setErrorMsg("Please enter your Mobile Number or Email.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);
    await loginCitizen({
      emailOrPhone: citizenEmailOrPhone,
      name: citizenName,
    });
    setIsLoading(false);
  };

  const handleCitizenDemo = async () => {
    setCitizenEmailOrPhone("9876543210");
    setCitizenName("Sundaram K. (Citizen)");
    setIsLoading(true);
    await loginCitizen({
      emailOrPhone: "9876543210",
      name: "Sundaram K. (Citizen)",
    });
    setIsLoading(false);
  };

  const handleOfficialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officialId.trim() || !officialPasskey.trim()) {
      setErrorMsg("Please enter both Official ID and Passkey.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);
    const success = await loginOfficial({
      officialId,
      passkey: officialPasskey,
    });
    setIsLoading(false);
    if (!success) {
      setErrorMsg(
        "Invalid Official Credentials. Please use OFFICER-741 / SENTINEL@2026 or officer@gov.in / Admin@123"
      );
    }
  };

  const handleOfficialDemo = () => {
    setOfficialId("officer@gov.in");
    setOfficialPasskey("Admin@123");
    setErrorMsg("");
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-command-900 border border-command-border rounded-xl shadow-2xl overflow-hidden text-gray-100 max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-command-950 border-b border-command-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-infra/10 border border-infra/40 text-infra">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider text-white uppercase">
                Sentinel-X Access Portal
              </h2>
              <p className="text-[10px] text-gray-400">
                Tamil Nadu State Disaster Management Authentication
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-command-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dual Tabs */}
        <div className="grid grid-cols-2 bg-command-950 border-b border-command-border text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab("citizen");
              setErrorMsg("");
            }}
            className={`py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "citizen"
                ? "border-cyan-400 text-cyan-300 bg-command-900"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Citizen Sign In</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("official");
              setErrorMsg("");
            }}
            className={`py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "official"
                ? "border-amber-400 text-amber-300 bg-command-900"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Gov Official</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === "citizen" ? (
            /* Citizen Form */
            <form onSubmit={handleCitizenSubmit} className="space-y-4">
              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-cyan-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-cyan-300">
                  <Sparkles className="h-3.5 w-3.5" /> Public Access Benefits
                </p>
                <p className="text-[11px] text-cyan-300/80 leading-relaxed">
                  Sign in as a Citizen to receive localized weather warnings, save shelter bookmarks, and dispatch high-priority SOS emergency signals.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">
                  Mobile Number or Email Address
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={citizenEmailOrPhone}
                    onChange={(e) => setCitizenEmailOrPhone(e.target.value)}
                    placeholder="+91 98765 43210 or name@example.com"
                    className="w-full rounded-lg bg-command-950 border border-command-border pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">
                  Full Name <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="e.g. Sundaram K."
                    className="w-full rounded-lg bg-command-950 border border-command-border pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <span>Signing In...</span>
                  ) : (
                    <>
                      <span>Enter Citizen Portal</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCitizenDemo}
                  className="w-full py-2 rounded-lg bg-command-950 border border-command-border text-gray-400 hover:text-white hover:bg-command-800 transition-colors text-[11px]"
                >
                  ⚡ Quick 1-Click Demo Citizen Sign In
                </button>
              </div>
            </form>
          ) : (
            /* Official Form */
            <form onSubmit={handleOfficialSubmit} className="space-y-4">
              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-300">
                  <ShieldCheck className="h-4 w-4 text-amber-400" /> Restricted Government Portal
                </p>
                <p className="text-[11px] text-amber-300/80 leading-relaxed">
                  For SDMA officers, first responders, and emergency commanders. Requires official badge code & secure passkey.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">
                  Official ID / Badge Code
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={officialId}
                    onChange={(e) => setOfficialId(e.target.value)}
                    placeholder="OFFICER-741 or officer@gov.in"
                    className="w-full rounded-lg bg-command-950 border border-command-border pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">
                  Secure Passkey
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={officialPasskey}
                    onChange={(e) => setOfficialPasskey(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg bg-command-950 border border-command-border pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Access Command Operations</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleOfficialDemo}
                  className="w-full py-2 rounded-lg bg-command-950 border border-command-border text-amber-400/80 hover:text-amber-300 hover:bg-command-800 transition-colors text-[11px] font-mono flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="h-3.5 w-3.5" /> Auto-Fill Demo Officer Credentials
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
