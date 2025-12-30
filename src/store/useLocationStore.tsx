import { create } from "zustand";

type Location = {
  lat: number | null;
  lon: number | null;
  setLocation: (lat: number, lon: number) => void;
};

export const useLocationStore = create<Location>((set) => ({
  lat: 37.5510697,
  lon: 126.9882562,
  setLocation: (lat, lon) => set({ lat, lon }),
}));
