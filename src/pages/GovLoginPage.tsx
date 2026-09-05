import { useState } from "react";
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, KeyRound } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export function GovLoginPage() {
  const { loginGov, setActivePage } = useAppContext();
  const [email, setEmail] = useState("officer@gov.in");
  const [password, setPassword] = useState("Admin@123");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      const res = loginGov(email, password);
      setIsLoading(false);
      if (res.success) {
        setActivePage("gov-dashboard");
      } else {
        setErrorMsg(res.message || "Invalid officer credentials.");
      }
    }, 400);
  };

  const handleFillDemoCreds = () => {
    setEmail("officer@gov.in");
    setPassword("Admin@123");
    setErrorMsg("");
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4 bg-command-950 text-gray-200">
      <div className="w-full max-w-md bg-command-900 border border-command-border rounded-xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-infra/10 border border-infra/40 text-infra">
            <ShieldCheck className="h-8 w-8" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-white uppercase">
              Government Portal
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Tamil Nadu State Disaster Management Authority (TN-SDMA)
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
            <Lock className="h-3 w-3" /> RESTRICTED OFFICER ACCESS
          </div>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="rounded-lg bg-command-950 border border-command-border p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-300 flex items-center gap-1 text-[11px] uppercase tracking-wider">
              <KeyRound className="h-3.5 w-3.5 text-infra" /> Demonstration Credentials
            </span>
            <button
              type="button"
              onClick={handleFillDemoCreds}
              className="text-[10px] text-infra hover:underline font-medium"
            >
              Auto-Fill
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-command-900 px-2 py-1 rounded border border-command-border text-gray-400">
              Email: <span className="text-white">officer@gov.in</span>
            </div>
            <div className="bg-command-900 px-2 py-1 rounded border border-command-border text-gray-400">
              Passcode: <span className="text-white">Admin@123</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Official Email / Officer ID
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@gov.in"
                className="w-full rounded-lg bg-command-950 border border-command-border pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-infra"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Officer Passcode
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-command-950 border border-command-border pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-infra"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-infra/20 hover:bg-infra/30 border border-infra/50 text-infra font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <span>Authenticating Officer...</span>
            ) : (
              <>
                <span>Access Command Operations</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <p className="text-center text-[10px] text-gray-500">
          Unauthorized access attempts are monitored & logged under IT Act Section 70.
        </p>
      </div>
    </div>
  );
}
