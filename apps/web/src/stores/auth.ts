import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OWNER' | 'STAFF' | 'GUEST';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (payload: { user: User; tokens: { access: string; refresh: string } }) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  login: ({ user, tokens }) => {
    set({ user, accessToken: tokens.access, refreshToken: tokens.refresh });
  },
  logout: () => set({ user: null, accessToken: null, refreshToken: null })
}));