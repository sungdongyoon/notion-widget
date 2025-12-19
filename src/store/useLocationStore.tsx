import { create } from "zustand";

type Location = {
  lat: number;
  lon: number;
  setLocation: (lat: number, lon: number) => void;
};

export const useLocationStore = create<Location>((set) => ({
  lat: 0,
  lon: 0,
  setLocation: (lat, lon) => set({ lat, lon }),
}));
