import { create } from 'zustand';
import type { Response } from '../types/survey';

export interface FilterState {
  age: string[];
  gender: string[];
  location: string[];
  householdType: string[];
  economicCapacity: string[];
}

interface FilterStore {
  filters: FilterState;
  setAgeFilter: (ages: string[]) => void;
  setGenderFilter: (genders: string[]) => void;
  setLocationFilter: (locations: string[]) => void;
  setHouseholdTypeFilter: (types: string[]) => void;
  setEconomicCapacityFilter: (capacities: string[]) => void;
  clearFilters: () => void;
  getFilteredResponses: (allResponses: Response[]) => Response[];
  hasActiveFilters: () => boolean;
}

const initialFilters: FilterState = {
  age: [],
  gender: [],
  location: [],
  householdType: [],
  economicCapacity: [],
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  filters: initialFilters,

  setAgeFilter: (ages) =>
    set((state) => ({
      filters: { ...state.filters, age: ages },
    })),

  setGenderFilter: (genders) =>
    set((state) => ({
      filters: { ...state.filters, gender: genders },
    })),

  setLocationFilter: (locations) =>
    set((state) => ({
      filters: { ...state.filters, location: locations },
    })),

  setHouseholdTypeFilter: (types) =>
    set((state) => ({
      filters: { ...state.filters, householdType: types },
    })),

  setEconomicCapacityFilter: (capacities) =>
    set((state) => ({
      filters: { ...state.filters, economicCapacity: capacities },
    })),

  clearFilters: () => set({ filters: initialFilters }),

  hasActiveFilters: () => {
    const { filters } = get();
    return (
      filters.age.length > 0 ||
      filters.gender.length > 0 ||
      filters.location.length > 0 ||
      filters.householdType.length > 0 ||
      filters.economicCapacity.length > 0
    );
  },

  getFilteredResponses: (allResponses: Response[]) => {
    const { filters } = get();

    // If no filters are active, return all responses
    if (!get().hasActiveFilters()) {
      return allResponses;
    }

    return allResponses.filter((response) => {
      // Age filter
      if (filters.age.length > 0) {
        const responseAge = response.data.demografi.hva_er_din_alder;
        if (!responseAge || !filters.age.includes(responseAge)) {
          return false;
        }
      }

      // Gender filter
      if (filters.gender.length > 0) {
        const responseGender = response.data.demografi.kjønn;
        if (!responseGender || !filters.gender.includes(responseGender)) {
          return false;
        }
      }

      // Location filter
      if (filters.location.length > 0) {
        const responseLocation = response.data.diverse.hvor_i_rendalen_kommune_bor_du;
        if (!responseLocation || !filters.location.includes(responseLocation)) {
          return false;
        }
      }

      // Household type filter
      if (filters.householdType.length > 0) {
        const responseHousehold = response.data.demografi.hvordan_ser_din_husstand_ut;
        if (!responseHousehold || !filters.householdType.includes(responseHousehold)) {
          return false;
        }
      }

      // Economic capacity filter (buying power)
      if (filters.economicCapacity.length > 0) {
        const responseCapacity = response.data.okonomi.dersom_du_skulle_kjøpe_bolig_hva_er_din_anslåtte_maksimale_kjøpesumbyggekostnad;
        if (!responseCapacity || !filters.economicCapacity.includes(responseCapacity)) {
          return false;
        }
      }

      return true;
    });
  },
}));
