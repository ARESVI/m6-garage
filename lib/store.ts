import { create } from 'zustand';

interface AppState {
  selectedCustomerId: string | null;
  selectedMotorcycleId: string | null;
  setSelectedCustomer: (id: string | null) => void;
  setSelectedMotorcycle: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedCustomerId: null,
  selectedMotorcycleId: null,
  setSelectedCustomer: (id) => set({ selectedCustomerId: id }),
  setSelectedMotorcycle: (id) => set({ selectedMotorcycleId: id }),
}));
