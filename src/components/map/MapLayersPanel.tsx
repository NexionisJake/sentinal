import { useState } from "react";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import type { MapLayerState } from "../../types";
import { layerLabels } from "../../data/mapLayers";

interface Props {
  layers: MapLayerState;
  onToggle: (key: keyof MapLayerState) => void;
}

export function MapLayersPanel({ layers, onToggle }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="absolute right-3 top-3 z-[500] flex h-9 w-9 items-center justify-center rounded-lg border border-command-border bg-command-900/90 backdrop-blur text-gray-300 hover:text-white shadow-lg"
        aria-label="Expand map layers panel"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="absolute right-3 top-3 z-[500] w-56 rounded-lg border border-command-border bg-command-900/90 backdrop-blur shadow-lg">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-command-border">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-300">
          <Layers className="h-3.5 w-3.5" /> Map Layers
        </p>
        <button onClick={() => setCollapsed(true)} className="text-gray-500 hover:text-gray-200" aria-label="Collapse panel">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="py-1.5 max-h-80 overflow-y-auto">
        {layerLabels.map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-300 hover:bg-command-800 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={layers[key]}
              onChange={() => onToggle(key)}
              className="h-3.5 w-3.5 rounded border-command-500 bg-command-800 accent-infra"
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}
