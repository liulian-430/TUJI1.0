import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  theme: 'light' | 'dark';
  searchHistory: string[];
  toasts: Toast[];
  isLoading: boolean;
  loadingMessage: string;
  sidebarCollapsed: boolean;

  // 主题
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // 搜索历史
  addSearchHistory: (keyword: string) => void;
  clearSearchHistory: () => void;

  // Toast
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Loading
  setLoading: (isLoading: boolean, message?: string) => void;

  // Sidebar
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      searchHistory: [],
      toasts: [],
      isLoading: false,
      loadingMessage: '',
      sidebarCollapsed: false,

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },

      setTheme: (theme) => {
        set({ theme });
      },

      addSearchHistory: (keyword) => {
        set((state) => {
          const newHistory = [keyword, ...state.searchHistory.filter((k) => k !== keyword)].slice(0, 10);
          return { searchHistory: newHistory };
        });
      },

      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },

      addToast: (toastData) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const toast: Toast = { ...toastData, id };

        set((state) => ({ toasts: [...state.toasts, toast] }));

        // 自动移除
        if (toast.duration !== 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, toast.duration || 3000);
        }
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      setLoading: (isLoading, message = '') => {
        set({ isLoading, loadingMessage: message });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },
    }),
    {
      name: 'ui-storage',
      version: 1,
      partialize: (state) => ({
        theme: state.theme,
        searchHistory: state.searchHistory,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);