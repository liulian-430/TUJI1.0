import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { checkAndMigrate } from '../utils/version'
import { DATA_SCHEMA_VERSION } from '../config/version'

const initialState = {
  theme: 'light',
  language: 'zh-CN',
  searchHistory: [],
  toast: null,
  loading: false,
  loadingText: '',
  isSidebarOpen: true,
  isCreateModalOpen: false,
  isUpdateModalOpen: false,
  updateInfo: null,
  notifications: true,
  soundEnabled: true,
  schemaVersion: DATA_SCHEMA_VERSION
}

export const useUIStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      setTheme: (theme) => {
        set({ theme })
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      toggleTheme: () => {
        const { theme } = get()
        get().setTheme(theme === 'light' ? 'dark' : 'light')
      },

      setLanguage: (language) => set({ language }),

      addSearchHistory: (keyword) => {
        if (!keyword || keyword.trim() === '') return
        set((state) => {
          const newHistory = [
            keyword.trim(),
            ...state.searchHistory.filter(k => k !== keyword.trim())
          ].slice(0, 10)
          return { searchHistory: newHistory }
        })
      },

      clearSearchHistory: () => {
        set({ searchHistory: [] })
      },

      removeSearchHistory: (keyword) => {
        set((state) => ({
          searchHistory: state.searchHistory.filter(k => k !== keyword)
        }))
      },

      showToast: (message, type = 'info', duration = 3000) => {
        const id = Date.now()
        set({ toast: { id, message, type, duration } })
        
        if (duration > 0) {
          setTimeout(() => {
            const currentToast = get().toast
            if (currentToast && currentToast.id === id) {
              set({ toast: null })
            }
          }, duration)
        }
      },

      hideToast: () => set({ toast: null }),

      showLoading: (text = '加载中...') => {
        set({ loading: true, loadingText: text })
      },

      hideLoading: () => {
        set({ loading: false, loadingText: '' })
      },

      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
      },

      setSidebarOpen: (isOpen) => {
        set({ isSidebarOpen: isOpen })
      },

      openCreateModal: () => set({ isCreateModalOpen: true }),
      closeCreateModal: () => set({ isCreateModalOpen: false }),

      openUpdateModal: (updateInfo) => set({ 
        isUpdateModalOpen: true,
        updateInfo 
      }),
      closeUpdateModal: () => set({ 
        isUpdateModalOpen: false,
        updateInfo: null 
      }),

      setNotifications: (enabled) => set({ notifications: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      successToast: (message) => get().showToast(message, 'success'),
      errorToast: (message) => get().showToast(message, 'error'),
      warningToast: (message) => get().showToast(message, 'warning'),
      infoToast: (message) => get().showToast(message, 'info')
    }),
    {
      name: 'tuji-ui-store',
      version: DATA_SCHEMA_VERSION,
      migrate: (persistedState, version) => {
        const { data } = checkAndMigrate('ui-store', persistedState)
        return data
      },
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        searchHistory: state.searchHistory,
        isSidebarOpen: state.isSidebarOpen,
        notifications: state.notifications,
        soundEnabled: state.soundEnabled,
        schemaVersion: state.schemaVersion
      })
    }
  )
)

export default useUIStore
