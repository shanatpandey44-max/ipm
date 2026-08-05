import { create } from "zustand";
import type { PropertyFilters, CityName, PropertyType } from "@/lib/types";

interface FilterState {
  filters: PropertyFilters;
  setFilter: <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => void;
  setFilters: (filters: Partial<PropertyFilters>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: PropertyFilters = {
  city: "",
  type: "",
  status: "",
  search: "",
  sort: "newest",
  page: 1,
  limit: 12,
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: DEFAULT_FILTERS,

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: key !== "page" ? 1 : (value as number) },
    })),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
