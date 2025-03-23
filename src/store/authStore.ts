import { create } from 'zustand';

interface AuthState {
  userId: string | null;
  setUserId: (id: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
  logout: () => set({ userId: null }),
}));