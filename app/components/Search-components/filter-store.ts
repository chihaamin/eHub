"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FilterRange {
  min: number | null;
  max: number | null;
}

export interface SearchFilters {
  // Overall
  overall: FilterRange;
  // Attacking
  offensiveAwareness: FilterRange;
  ballControl: FilterRange;
  dribbling: FilterRange;
  finishing: FilterRange;
  lowPass: FilterRange;
  loftedPass: FilterRange;
  // Defending
  defensiveAwareness: FilterRange;
  ballWinning: FilterRange;
  // Physical
  speed: FilterRange;
  acceleration: FilterRange;
  physicalContact: FilterRange;
  stamina: FilterRange;
  // Position
  position: string | null;
  // Stronger Foot
  strongerFoot: string | null;
}

export const defaultFilters: SearchFilters = {
  overall: { min: null, max: null },
  offensiveAwareness: { min: null, max: null },
  ballControl: { min: null, max: null },
  dribbling: { min: null, max: null },
  finishing: { min: null, max: null },
  lowPass: { min: null, max: null },
  loftedPass: { min: null, max: null },
  defensiveAwareness: { min: null, max: null },
  ballWinning: { min: null, max: null },
  speed: { min: null, max: null },
  acceleration: { min: null, max: null },
  physicalContact: { min: null, max: null },
  stamina: { min: null, max: null },
  position: null,
  strongerFoot: null,
};

interface FilterStore {
  filters: SearchFilters;
  setFilter: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => void;
  setRangeFilter: (
    key: keyof SearchFilters,
    field: "min" | "max",
    value: number | null,
  ) => void;
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
  getActiveFilterCount: () => number;
}

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,
      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        }));
      },
      setRangeFilter: (key, field, value) => {
        set((state) => {
          const currentRange = state.filters[key] as FilterRange;
          return {
            filters: {
              ...state.filters,
              [key]: { ...currentRange, [field]: value },
            },
          };
        });
      },
      resetFilters: () => {
        set({ filters: defaultFilters });
      },
      hasActiveFilters: () => {
        const { filters } = get();
        return Object.entries(filters).some(([, value]) => {
          if (value === null) return false;
          if (typeof value === "string") return true;
          if (typeof value === "object" && value !== null) {
            return value.min !== null || value.max !== null;
          }
          return false;
        });
      },
      getActiveFilterCount: () => {
        const { filters } = get();
        let count = 0;
        Object.entries(filters).forEach(([, value]) => {
          if (value === null) return;
          if (typeof value === "string") {
            count++;
          } else if (typeof value === "object" && value !== null) {
            if (value.min !== null || value.max !== null) count++;
          }
        });
        return count;
      },
    }),
    {
      name: "search-filters",
    },
  ),
);

// Positions for filtering
export const POSITIONS = [
  { value: "GK", label: "Goalkeeper" },
  { value: "CB", label: "Center Back" },
  { value: "LB", label: "Left Back" },
  { value: "RB", label: "Right Back" },
  { value: "DMF", label: "Defensive Mid" },
  { value: "CMF", label: "Center Mid" },
  { value: "LMF", label: "Left Mid" },
  { value: "RMF", label: "Right Mid" },
  { value: "AMF", label: "Attacking Mid" },
  { value: "LWF", label: "Left Wing" },
  { value: "RWF", label: "Right Wing" },
  { value: "SS", label: "Second Striker" },
  { value: "CF", label: "Center Forward" },
];

export const STRONGER_FOOT = [
  { value: "1", label: "Right Foot" },
  { value: "0", label: "Left Foot" },
];
