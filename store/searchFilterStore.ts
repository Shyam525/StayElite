import { create } from "zustand";

export type GuestCounts = { adults: number; children: number; infants: number };
export type SearchFilters = { location: string; checkIn: string; checkOut: string; guests: GuestCounts; category: string; minPrice: number; maxPrice: number; propertyTypes: string[]; bedrooms: number; beds: number; amenities: string[] };

export const defaultSearchFilters: SearchFilters = { location: "", checkIn: "", checkOut: "", guests: { adults: 1, children: 0, infants: 0 }, category: "", minPrice: 0, maxPrice: 1000, propertyTypes: [], bedrooms: 0, beds: 0, amenities: [] };

type SearchFilterState = { filters: SearchFilters; setFilters: (updates: Partial<SearchFilters>) => void; resetFilters: () => void };
export const useSearchFilterStore = create<SearchFilterState>((set) => ({ filters: defaultSearchFilters, setFilters: (updates) => set((state) => ({ filters: { ...state.filters, ...updates } })), resetFilters: () => set({ filters: defaultSearchFilters }) }));
