import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId, calculateDistance, formatCurrency } from '../utils/helpers'
import { checkAndMigrate } from '../utils/version'
import { DATA_SCHEMA_VERSION } from '../config/version'
import { pois, getPOIById, getPOIsByCity, POI_TYPES } from '../data/pois'

const createEmptyDay = (dayIndex) => ({
  id: generateId('day'),
  dayNumber: dayIndex + 1,
  date: null,
  items: []
})

const createTripItemFromPOI = (poi, options = {}) => ({
  id: generateId('item'),
  poiId: poi.id,
  name: poi.name,
  type: poi.type,
  image: poi.images?.[0] || '',
  startTime: options.startTime || '09:00',
  duration: options.duration || poi.duration || 120,
  price: poi.price || 0,
  address: poi.address || '',
  lat: poi.lat,
  lng: poi.lng,
  notes: ''
})

const initialState = {
  trips: [],
  currentTripId: null,
  currentDayIndex: 0,
  favorites: [],
  budget: {
    total: 0,
    categories: {
      transport: 0,
      accommodation: 0,
      food: 0,
      tickets: 0,
      shopping: 0,
      other: 0
    }
  },
  expenses: [],
  schemaVersion: DATA_SCHEMA_VERSION
}

export const useTripStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      get currentTrip() {
        const { trips, currentTripId } = get()
        return trips.find(trip => trip.id === currentTripId) || null
      },

      get currentDay() {
        const { currentTrip, currentDayIndex } = get()
        if (!currentTrip || !currentTrip.days) return null
        return currentTrip.days[currentDayIndex] || null
      },

      createTrip: (tripData) => {
        const { days, ...rest } = tripData
        const tripDays = []
        const totalDays = days || 1
        
        for (let i = 0; i < totalDays; i++) {
          tripDays.push(createEmptyDay(i))
        }

        const newTrip = {
          id: generateId('trip'),
          name: rest.name || '我的旅行',
          city: rest.city || '',
          cityName: rest.cityName || '',
          days: tripDays,
          nights: rest.nights || totalDays - 1,
          travelers: rest.travelers || 1,
          startDate: rest.startDate || null,
          endDate: rest.endDate || null,
          budget: rest.budget || 0,
          status: 'planning',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          ...rest
        }

        set((state) => ({
          trips: [...state.trips, newTrip],
          currentTripId: newTrip.id,
          currentDayIndex: 0
        }))

        return newTrip
      },

      updateTrip: (tripId, updates) => {
        set((state) => ({
          trips: state.trips.map(trip =>
            trip.id === tripId
              ? { ...trip, ...updates, updatedAt: Date.now() }
              : trip
          )
        }))
      },

      deleteTrip: (tripId) => {
        set((state) => {
          const newTrips = state.trips.filter(trip => trip.id !== tripId)
          const newCurrentId = state.currentTripId === tripId
            ? (newTrips[0]?.id || null)
            : state.currentTripId
          return {
            trips: newTrips,
            currentTripId: newCurrentId,
            currentDayIndex: 0
          }
        })
      },

      setCurrentTrip: (tripId) => {
        set({ currentTripId: tripId, currentDayIndex: 0 })
      },

      setCurrentDay: (dayIndex) => {
        set({ currentDayIndex: dayIndex })
      },

      addDay: (tripId) => {
        set((state) => ({
          trips: state.trips.map(trip => {
            if (trip.id !== tripId) return trip
            const newDayNumber = trip.days.length + 1
            return {
              ...trip,
              days: [...trip.days, createEmptyDay(trip.days.length)],
              updatedAt: Date.now()
            }
          })
        }))
      },

      removeDay: (tripId, dayIndex) => {
        set((state) => ({
          trips: state.trips.map(trip => {
            if (trip.id !== tripId) return trip
            const newDays = trip.days.filter((_, i) => i !== dayIndex)
            return {
              ...trip,
              days: newDays,
              updatedAt: Date.now()
            }
          }),
          currentDayIndex: state.currentDayIndex >= dayIndex && state.currentDayIndex > 0
            ? state.currentDayIndex - 1
            : state.currentDayIndex
        }))
      },

      addItemToDay: (tripId, dayIndex, poi, options = {}) => {
        const newItem = createTripItemFromPOI(poi, options)
        set((state) => ({
          trips: state.trips.map(trip => {
            if (trip.id !== tripId) return trip
            const newDays = trip.days.map((day, i) => {
              if (i !== dayIndex) return day
              return { ...day, items: [...day.items, newItem] }
            })
            return { ...trip, days: newDays, updatedAt: Date.now() }
          })
        }))
        return newItem
      },

      removeItemFromDay: (tripId, dayIndex, itemId) => {
        set((state) => ({
          trips: state.trips.map(trip => {
            if (trip.id !== tripId) return trip
            const newDays = trip.days.map((day, i) => {
              if (i !== dayIndex) return day
              return { ...day, items: day.items.filter(item => item.id !== itemId) }
            })
            return { ...trip, days: newDays, updatedAt: Date.now() }
          })
        }))
      },

      updateItem: (tripId, dayIndex, itemId, updates) => {
        set((state) => ({
          trips: state.trips.map(trip => {
            if (trip.id !== tripId) return trip
            const newDays = trip.days.map((day, i) => {
              if (i !== dayIndex) return day
              return {
                ...day,
                items: day.items.map(item =>
                  item.id === itemId ? { ...item, ...updates } : item
                )
              }
            })
            return { ...trip, days: newDays, updatedAt: Date.now() }
          })
        }))
      },

      moveItem: (tripId, dayIndex, fromIndex, toIndex) => {
        set((state) => ({
          trips: state.trips.map(trip => {
            if (trip.id !== tripId) return trip
            const newDays = trip.days.map((day, i) => {
              if (i !== dayIndex) return day
              const newItems = [...day.items]
              const [removed] = newItems.splice(fromIndex, 1)
              newItems.splice(toIndex, 0, removed)
              return { ...day, items: newItems }
            })
            return { ...trip, days: newDays, updatedAt: Date.now() }
          })
        }))
      },

      moveItemUp: (tripId, dayIndex, itemIndex) => {
        if (itemIndex <= 0) return
        get().moveItem(tripId, dayIndex, itemIndex, itemIndex - 1)
      },

      moveItemDown: (tripId, dayIndex, itemIndex) => {
        const trip = get().trips.find(t => t.id === tripId)
        if (!trip) return
        const day = trip.days[dayIndex]
        if (!day || itemIndex >= day.items.length - 1) return
        get().moveItem(tripId, dayIndex, itemIndex, itemIndex + 1)
      },

      copyTrip: (tripId) => {
        const { trips } = get()
        const trip = trips.find(t => t.id === tripId)
        if (!trip) return null

        const newTrip = {
          ...trip,
          id: generateId('trip'),
          name: `${trip.name} (副本)`,
          status: 'planning',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          days: trip.days.map(day => ({
            ...day,
            id: generateId('day'),
            items: day.items.map(item => ({
              ...item,
              id: generateId('item')
            }))
          }))
        }

        set((state) => ({
          trips: [...state.trips, newTrip]
        }))

        return newTrip
      },

      addFavorite: (poiId) => {
        set((state) => {
          if (state.favorites.includes(poiId)) return state
          return { favorites: [...state.favorites, poiId] }
        })
      },

      removeFavorite: (poiId) => {
        set((state) => ({
          favorites: state.favorites.filter(id => id !== poiId)
        }))
      },

      toggleFavorite: (poiId) => {
        const { favorites } = get()
        if (favorites.includes(poiId)) {
          get().removeFavorite(poiId)
          return false
        } else {
          get().addFavorite(poiId)
          return true
        }
      },

      isFavorite: (poiId) => {
        return get().favorites.includes(poiId)
      },

      setBudget: (total, categories = {}) => {
        set((state) => ({
          budget: {
            total,
            categories: { ...state.budget.categories, ...categories }
          }
        }))
      },

      addExpense: (expense) => {
        const newExpense = {
          id: generateId('expense'),
          ...expense,
          createdAt: Date.now()
        }
        set((state) => ({
          expenses: [...state.expenses, newExpense]
        }))
        return newExpense
      },

      updateExpense: (expenseId, updates) => {
        set((state) => ({
          expenses: state.expenses.map(exp =>
            exp.id === expenseId ? { ...exp, ...updates } : exp
          )
        }))
      },

      deleteExpense: (expenseId) => {
        set((state) => ({
          expenses: state.expenses.filter(exp => exp.id !== expenseId)
        }))
      },

      getExpensesByCategory: (category) => {
        return get().expenses.filter(exp => exp.category === category)
      },

      getTotalExpenses: () => {
        return get().expenses.reduce((sum, exp) => sum + exp.amount, 0)
      },

      getTripStats: (tripId) => {
        const trip = get().trips.find(t => t.id === tripId)
        if (!trip) return null

        let totalPOIs = 0
        let totalDistance = 0
        let totalCost = 0

        trip.days.forEach((day, dayIndex) => {
          totalPOIs += day.items.length
          totalCost += day.items.reduce((sum, item) => sum + (item.price || 0), 0)

          if (day.items.length > 1) {
            for (let i = 0; i < day.items.length - 1; i++) {
              const item1 = day.items[i]
              const item2 = day.items[i + 1]
              if (item1.lat && item1.lng && item2.lat && item2.lng) {
                totalDistance += calculateDistance(item1.lat, item1.lng, item2.lat, item2.lng)
              }
            }
          }
        })

        return {
          totalPOIs,
          totalDistance,
          totalCost,
          totalDays: trip.days.length
        }
      },

      generateAItinerary: ({ city, days, preferences = [], budget = 'medium', travelers = 1 }) => {
        const cityPOIs = getPOIsByCity(city)
        const attractions = cityPOIs.filter(p => p.type === POI_TYPES.ATTRACTION)
        const restaurants = cityPOIs.filter(p => p.type === POI_TYPES.RESTAURANT)

        let sortedPOIs = [...attractions]
        if (preferences.length > 0) {
          sortedPOIs = sortedPOIs.map(poi => ({
            ...poi,
            score: poi.preferenceTags?.filter(tag => preferences.includes(tag)).length || 0
          })).sort((a, b) => b.score - a.score)
        } else {
          sortedPOIs.sort((a, b) => b.rating - a.rating)
        }

        const newTrip = get().createTrip({
          name: `${city} ${days}日游`,
          city,
          days,
          travelers,
          budget: budget === 'low' ? 2000 : budget === 'high' ? 10000 : 5000
        })

        const poisPerDay = Math.ceil(sortedPOIs.length / days)

        for (let dayIndex = 0; dayIndex < days; dayIndex++) {
          const dayPOIs = sortedPOIs.slice(dayIndex * poisPerDay, (dayIndex + 1) * poisPerDay)
          
          let currentTime = 9 * 60

          if (restaurants.length > 0) {
            const breakfast = restaurants[dayIndex % restaurants.length]
            get().addItemToDay(newTrip.id, dayIndex, breakfast, {
              startTime: '08:00',
              duration: 60
            })
            currentTime = 9 * 60
          }

          dayPOIs.forEach((poi, poiIndex) => {
            const hours = Math.floor(currentTime / 60)
            const mins = currentTime % 60
            const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
            
            get().addItemToDay(newTrip.id, dayIndex, poi, {
              startTime: timeStr,
              duration: poi.duration || 120
            })
            currentTime += (poi.duration || 120) + 30

            if (poiIndex === Math.floor(dayPOIs.length / 2) && restaurants.length > 0) {
              const lunch = restaurants[(dayIndex + 1) % restaurants.length]
              const lunchHours = Math.floor(currentTime / 60)
              const lunchMins = currentTime % 60
              get().addItemToDay(newTrip.id, dayIndex, lunch, {
                startTime: `${String(lunchHours).padStart(2, '0')}:${String(lunchMins).padStart(2, '0')}`,
                duration: 90
              })
              currentTime += 90
            }
          })

          if (restaurants.length > 0) {
            const dinner = restaurants[(dayIndex + 2) % restaurants.length]
            const dinnerHours = 19
            get().addItemToDay(newTrip.id, dayIndex, dinner, {
              startTime: `${dinnerHours}:00`,
              duration: 90
            })
          }
        }

        return newTrip
      }
    }),
    {
      name: 'tuji-trip-store',
      version: DATA_SCHEMA_VERSION,
      migrate: (persistedState, version) => {
        const { data } = checkAndMigrate('trip-store', persistedState)
        return data
      },
      partialize: (state) => ({
        trips: state.trips,
        currentTripId: state.currentTripId,
        currentDayIndex: state.currentDayIndex,
        favorites: state.favorites,
        budget: state.budget,
        expenses: state.expenses,
        schemaVersion: state.schemaVersion
      })
    }
  )
)

export default useTripStore
