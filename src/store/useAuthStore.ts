import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/utils/http';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (phone: string, code: string) => Promise<void>;
  register: (phone: string, code: string) => Promise<void>;
  sendCode: (phone: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: async (phone: string, code: string) => {
        const res: any = await api.post('/auth/login', { phone, code });
        const { access_token, refresh_token, user } = res;
        set({
          token: access_token,
          refreshToken: refresh_token,
          user,
          isAuthenticated: true,
        });
        localStorage.setItem('token', access_token);
      },

      register: async (phone: string, code: string) => {
        const res: any = await api.post('/auth/register', { phone, code });
        const { access_token, refresh_token, user } = res;
        set({
          token: access_token,
          refreshToken: refresh_token,
          user,
          isAuthenticated: true,
        });
        localStorage.setItem('token', access_token);
      },

      sendCode: async (phone: string) => {
        await api.post('/auth/send-code', { phone });
      },

      logout: () => {
        set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
        localStorage.removeItem('token');
      },

      fetchProfile: async () => {
        const res: any = await api.get('/user/profile');
        set({ user: res });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
