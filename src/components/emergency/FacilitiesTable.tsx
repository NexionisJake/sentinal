import type { Facility } from "../../types";

export function FacilitiesTable({ facilities }: { facilities: Facility[] }) {
  return (
    <div className="rounded-lg border border-command-border bg-command-850 overflow-hidden">
      <div className="px-4 py-3 border-b border-command-border">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Nearest Facilities</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-gray-500 border-b border-command-border">
              <th className="px-4 py-2.5 font-medium">Facility</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium text-right">Distance</th>
              <th className="px-4 py-2.5 font-medium text-right">Travel Time</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-command-border">
            {facilities.map((f) => (
              <tr key={f.id} className="hover:bg-command-800">
                <td className="px-4 py-2.5 text-gray-100 font-medium">{f.name}</td>
                <td className="px-4 py-2.5 text-gray-400 capitalize">{f.type}</td>
                <td className="px-4 py-2.5 text-right font-mono text-gray-300">{f.distanceKm.toFixed(1)} km</td>
                <td className="px-4 py-2.5 text-right font-mono text-gray-300">{f.travelTimeMin} min</td>
                <td className={`px-4 py-2.5 font-semibold ${f.statusOk ? "text-low" : "text-critical"}`}>{f.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
