import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

interface AdminState {
  isAdminMode: boolean;
  toggleAdminMode: () => void;
}

export const useAdminStore = create<AdminState>(
  persist(
    (set) => ({
      isAdminMode: false,
      toggleAdminMode: () => set((state) => ({ isAdminMode: !state.isAdminMode })),
    }),
    {
      name: 'admin-mode-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
