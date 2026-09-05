export function MapLegend() {
  return (
    <div className="absolute left-3 bottom-3 z-[500] rounded-lg border border-command-border bg-command-900/90 backdrop-blur px-3 py-2.5 text-[11px] text-gray-300 shadow-lg">
      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">Legend</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-critical inline-block" />Critical</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-high inline-block" />High</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-moderate inline-block" />Moderate</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-low inline-block" />Low</span>
      </div>
      <div className="mt-2 pt-2 border-t border-command-border grid grid-cols-2 gap-x-4 gap-y-1">
        <span>🌊 Flood</span>
        <span>🌀 Cyclone</span>
        <span>⛰️ Landslide</span>
        <span>🔥 Fire</span>
      </div>
    </div>
  );
}
