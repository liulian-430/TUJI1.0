import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

interface UserSettings {
  notifications: boolean;
  privacy: 'public' | 'private' | 'friends';
  language: 'zh-CN' | 'en-US';
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  settings: UserSettings;

  // 用户操作
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;

  // 认证操作
  setToken: (token: string) => void;
  clearToken: () => void;
  login: (user: User, token: string) => void;
  logout: () => void;

  // 游客模式
  setGuestMode: (isGuest: boolean) => void;

  // 设置操作
  updateSettings: (updates: Partial<UserSettings>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isGuest: true,
      settings: {
        notifications: true,
        privacy: 'public',
        language: 'zh-CN',
      },

      setUser: (user) => {
        set({ user, isAuthenticated: true, isGuest: false });
      },

      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      clearUser: () => {
        set({ user: null, isAuthenticated: false, isGuest: true });
      },

      setToken: (token) => {
        set({ token });
      },

      clearToken: () => {
        set({ token: null });
      },

      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isGuest: false,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isGuest: true,
        });
      },

      setGuestMode: (isGuest) => {
        set({ isGuest });
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },
    }),
    {
      name: 'user-storage',
      version: 1,
    }
  )
);