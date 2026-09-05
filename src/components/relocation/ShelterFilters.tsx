import { Search, Filter, ArrowUpDown } from "lucide-react";
import type { ShelterType } from "../../types";

export type SortBy = "distance" | "capacity" | "occupancy";
export type StatusFilter = "ALL" | "OPEN" | "NEAR_CAPACITY" | "NEAR_FULL" | "FULL";

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (f: StatusFilter) => void;
  typeFilter: "ALL" | ShelterType;
  onTypeFilterChange: (f: "ALL" | ShelterType) => void;
  selectedAmenities: string[];
  onToggleAmenity: (amenityKey: string) => void;
  sortBy: SortBy;
  onSortChange: (s: SortBy) => void;
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All Status" },
  { value: "OPEN", label: "Open Only" },
  { value: "NEAR_CAPACITY", label: "Near Capacity" },
  { value: "FULL", label: "Full" },
];

const typeOptions: { value: "ALL" | ShelterType; label: string }[] = [
  { value: "ALL", label: "All Facility Types" },
  { value: "CYCLONE_SHELTER", label: "Cyclone Shelter" },
  { value: "COMMUNITY_HALL", label: "Community Hall" },
  { value: "RELIEF_CAMP", label: "Relief Camp" },
  { value: "SCHOOL", label: "School" },
  { value: "STADIUM", label: "Stadium" },
];

const sortOptions: { value: SortBy; label: string }[] = [
  { value: "distance", label: "Distance (Nearest First)" },
  { value: "capacity", label: "Total Capacity" },
  { value: "occupancy", label: "Occupancy %" },
];

const AMENITY_TOGGLES = [
  { key: "MEDICAL", label: "Medical Bay", icon: "🏥" },
  { key: "PET_FRIENDLY", label: "Pet-Friendly", icon: "🐾" },
  { key: "WATER", label: "Water", icon: "💧" },
  { key: "FOOD", label: "Food", icon: "🍲" },
  { key: "POWER_BACKUP", label: "Power Backup", icon: "⚡" },
];

export function ShelterFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  selectedAmenities,
  onToggleAmenity,
  sortBy,
  onSortChange,
}: Props) {
  return (
    <div className="space-y-3 bg-command-900 border border-command-border rounded-xl p-3.5 shadow-md">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
        <input
          type="text"
          placeholder="Search shelter by name, district, or city..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-command-950 border border-command-border rounded-lg text-xs text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
        />
      </div>

      {/* Dropdown Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 bg-command-950 border border-command-border rounded-lg px-2 py-1 text-xs text-gray-400">
          <Filter className="h-3.5 w-3.5 text-cyan-400" />
          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(e.target.value as StatusFilter)
            }
            className="bg-transparent text-gray-200 focus:outline-none cursor-pointer text-xs"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-command-900 text-gray-200">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <select
          value={typeFilter}
          onChange={(e) =>
            onTypeFilterChange(e.target.value as "ALL" | ShelterType)
          }
          className="bg-command-950 border border-command-border rounded-lg text-xs text-gray-200 px-2 py-1.5 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
        >
          {typeOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-command-900 text-gray-200">
              {opt.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1.5 ml-auto bg-command-950 border border-command-border rounded-lg px-2 py-1 text-xs text-gray-400">
          <ArrowUpDown className="h-3.5 w-3.5 text-cyan-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            className="bg-transparent text-gray-200 focus:outline-none cursor-pointer text-xs"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-command-900 text-gray-200">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Amenity Filter Toggles */}
      <div className="pt-2 border-t border-command-border/60">
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
          Required Amenity Filters
        </p>
        <div className="flex flex-wrap gap-1.5">
          {AMENITY_TOGGLES.map((amenity) => {
            const isSelected = selectedAmenities.includes(amenity.key);
            return (
              <button
                key={amenity.key}
                onClick={() => onToggleAmenity(amenity.key)}
                className={`text-[10px] px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 font-semibold cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 ring-1 ring-cyan-400/40"
                    : "bg-command-950 text-gray-400 border-command-border hover:border-gray-500 hover:text-gray-300"
                }`}
              >
                <span>{amenity.icon}</span>
                <span>{amenity.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
