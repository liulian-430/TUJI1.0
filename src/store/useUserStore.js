import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { checkAndMigrate } from '../utils/version'
import { DATA_SCHEMA_VERSION } from '../config/version'
import { sha256Hash, generateUUID } from '../utils/security'
import { generateId } from '../utils/helpers'

const initialState = {
  isLoggedIn: false,
  isGuest: true,
  user: null,
  token: null,
  settings: {
    pushNotifications: true,
    emailNotifications: true,
    showFootprint: true,
    publicProfile: false,
    autoSync: true
  },
  footprint: [],
  schemaVersion: DATA_SCHEMA_VERSION
}

export const useUserStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (email, password) => {
        try {
          const hashedPassword = await sha256Hash(password)
          
          const mockUser = {
            id: generateId('user'),
            email,
            nickname: '旅行达人',
            avatar: '',
            bio: '热爱旅行，探索世界',
            createdAt: Date.now(),
            level: 1,
            exp: 0,
            tripsCount: 0,
            footprintCount: 0
          }

          const mockToken = 'mock_token_' + generateId()

          set({
            isLoggedIn: true,
            isGuest: false,
            user: mockUser,
            token: mockToken
          })

          return { success: true, user: mockUser }
        } catch (error) {
          return { success: false, message: error.message }
        }
      },

      register: async (email, password, nickname) => {
        try {
          const hashedPassword = await sha256Hash(password)

          const mockUser = {
            id: generateId('user'),
            email,
            nickname: nickname || '新用户',
            avatar: '',
            bio: '这个人很懒，什么都没写~',
            createdAt: Date.now(),
            level: 1,
            exp: 0,
            tripsCount: 0,
            footprintCount: 0
          }

          const mockToken = 'mock_token_' + generateId()

          set({
            isLoggedIn: true,
            isGuest: false,
            user: mockUser,
            token: mockToken
          })

          return { success: true, user: mockUser }
        } catch (error) {
          return { success: false, message: error.message }
        }
      },

      logout: () => {
        set({
          isLoggedIn: false,
          isGuest: true,
          user: null,
          token: null
        })
      },

      enterGuestMode: () => {
        set({
          isLoggedIn: false,
          isGuest: true,
          user: null,
          token: null
        })
      },

      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        }))
      },

      updateSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings }
        }))
      },

      addFootprint: (city, date) => {
        const newFootprint = {
          id: generateId('fp'),
          city,
          date: date || Date.now(),
          createdAt: Date.now()
        }
        set((state) => ({
          footprint: [newFootprint, ...state.footprint]
        }))
        return newFootprint
      },

      removeFootprint: (footprintId) => {
        set((state) => ({
          footprint: state.footprint.filter(fp => fp.id !== footprintId)
        }))
      },

      getFootprintCities: () => {
        const cities = new Set(get().footprint.map(fp => fp.city))
        return Array.from(cities)
      },

      hasToken: () => {
        return !!get().token
      },

      isAuthenticated: () => {
        return get().isLoggedIn && !!get().token
      }
    }),
    {
      name: 'tuji-user-store',
      version: DATA_SCHEMA_VERSION,
      migrate: (persistedState, version) => {
        const { data } = checkAndMigrate('user-store', persistedState)
        return data
      },
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        isGuest: state.isGuest,
        user: state.user,
        token: state.token,
        settings: state.settings,
        footprint: state.footprint,
        schemaVersion: state.schemaVersion
      })
    }
  )
)

export default useUserStore
