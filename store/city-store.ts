import { create } from "zustand";
import { persist } from "zustand/middleware";
import { divisions } from "@/lib/divisions";

interface City {
  name: string;
  value: string;
}

interface CityState {
  selectedCity: City;
  setSelectedCity: (city: City) => void;
}

export const useCityStore = create<CityState>()(
  persist(
    (set) => ({
      selectedCity: divisions[0],
      setSelectedCity: (city) => set({ selectedCity: city }),
    }),
    {
      name: "city-storage",
      // We only want to persist selectedCity
      partialize: (state) => ({ selectedCity: state.selectedCity }),
    },
  ),
);
