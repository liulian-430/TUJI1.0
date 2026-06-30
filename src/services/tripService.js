import useTripStore from '../store/useTripStore'
import { generateId } from '../utils/helpers'

const mockDelay = (data, delay = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

export const tripService = {
  async createTrip(tripData) {
    const newTrip = useTripStore.getState().createTrip(tripData)
    return mockDelay(newTrip)
  },

  async getTripList(params = {}) {
    const { status, page = 1, pageSize = 20 } = params
    const trips = useTripStore.getState().trips
    
    let result = [...trips]
    if (status) {
      result = result.filter(t => t.status === status)
    }
    result.sort((a, b) => b.updatedAt - a.updatedAt)
    
    const total = result.length
    const start = (page - 1) * pageSize
    const list = result.slice(start, start + pageSize)
    
    return mockDelay({ list, total, page, pageSize })
  },

  async getTripById(tripId) {
    const trip = useTripStore.getState().trips.find(t => t.id === tripId)
    return mockDelay(trip)
  },

  async updateTrip(tripId, updates) {
    useTripStore.getState().updateTrip(tripId, updates)
    const updatedTrip = useTripStore.getState().trips.find(t => t.id === tripId)
    return mockDelay(updatedTrip)
  },

  async deleteTrip(tripId) {
    useTripStore.getState().deleteTrip(tripId)
    return mockDelay({ success: true })
  },

  async copyTrip(tripId) {
    const newTrip = useTripStore.getState().copyTrip(tripId)
    return mockDelay(newTrip)
  },

  async generateItinerary(params) {
    const { city, days, preferences = [], budget = 'medium', travelers = 1 } = params
    const trip = useTripStore.getState().generateAItinerary({
      city, days, preferences, budget, travelers
    })
    return mockDelay(trip)
  },

  async addDay(tripId) {
    useTripStore.getState().addDay(tripId)
    const trip = useTripStore.getState().trips.find(t => t.id === tripId)
    return mockDelay(trip)
  },

  async removeDay(tripId, dayIndex) {
    useTripStore.getState().removeDay(tripId, dayIndex)
    const trip = useTripStore.getState().trips.find(t => t.id === tripId)
    return mockDelay(trip)
  },

  async addItem(tripId, dayIndex, poi, options) {
    const item = useTripStore.getState().addItemToDay(tripId, dayIndex, poi, options)
    return mockDelay(item)
  },

  async removeItem(tripId, dayIndex, itemId) {
    useTripStore.getState().removeItemFromDay(tripId, dayIndex, itemId)
    return mockDelay({ success: true })
  },

  async updateItem(tripId, dayIndex, itemId, updates) {
    useTripStore.getState().updateItem(tripId, dayIndex, itemId, updates)
    const trip = useTripStore.getState().trips.find(t => t.id === tripId)
    const item = trip?.days[dayIndex]?.items.find(i => i.id === itemId)
    return mockDelay(item)
  },

  async moveItem(tripId, dayIndex, fromIndex, toIndex) {
    useTripStore.getState().moveItem(tripId, dayIndex, fromIndex, toIndex)
    return mockDelay({ success: true })
  },

  async getTripStats(tripId) {
    const stats = useTripStore.getState().getTripStats(tripId)
    return mockDelay(stats)
  },

  async shareTrip(tripId) {
    const trip = useTripStore.getState().trips.find(t => t.id === tripId)
    const shareUrl = `${window.location.origin}/trip/${tripId}?share=1`
    return mockDelay({
      success: true,
      shareUrl,
      shareId: generateId('share')
    })
  },

  async exportTrip(tripId, format = 'json') {
    const trip = useTripStore.getState().trips.find(t => t.id === tripId)
    if (format === 'json') {
      const jsonStr = JSON.stringify(trip, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      return mockDelay({ url, filename: `${trip.name}.json` })
    }
    return mockDelay(null)
  }
}

export default tripService
