import { create } from 'zustand';

type AuthState = {
  isAuthenticated: boolean;
  profile: { firstName: string; lastName: string; email: string; role: string } | null;
  setIsAuthenticated: (value: boolean) => void;
  setProfile: (profile: { firstName: string; lastName: string; email: string; role: string }) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  isAuthenticated: false,
  setProfile: (profile) => set({ profile }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
}));
