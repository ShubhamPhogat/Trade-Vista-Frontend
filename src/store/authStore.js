import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
  logout: () => set({ userId: null }),
}));