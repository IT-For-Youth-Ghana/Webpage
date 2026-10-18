import { create } from "zustand";

type AdminStoreState = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

export const useAdminStore = create<AdminStoreState>((set) => ({
  activeSection: "dashboard",
  setActiveSection: (section) => set({ activeSection: section }),
}));
