import { create } from "zustand";

type Location = {
  lat: number | null;
  lon: number | null;
  setLocation: (lat: number, lon: number) => void;
};

export const useLocationStore = create<Location>((set) => ({
  lat: null,
  lon: null,
  setLocation: (lat, lon) => set({ lat, lon }),
}));
