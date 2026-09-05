import { AlertOctagon } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export function SOSButton() {
  const { openSOSModal } = useAppContext();

  return (
    <button
      onClick={openSOSModal}
      type="button"
      className="fixed bottom-18 md:bottom-6 right-5 z-[2000] flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-extrabold px-5 py-3 shadow-xl shadow-red-600/50 border-2 border-red-300 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
      aria-label="Trigger Emergency SOS Alert"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
      </span>
      <AlertOctagon className="h-5 w-5 animate-bounce text-white" strokeWidth={2.5} />
      <span className="tracking-widest text-sm uppercase">EMERGENCY SOS</span>
    </button>
  );
}
