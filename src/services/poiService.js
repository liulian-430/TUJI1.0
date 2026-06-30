import { pois, getPOIById as dataGetPOIById, getPOIsByCity as dataGetPOIsByCity, getPOIsByType as dataGetPOIsByType, searchPOIs as dataSearchPOIs, CITIES } from '../data/pois'
import { generateSignature, generateRequestId, generateTimestamp } from '../utils/security'

const mockDelay = (data, delay = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

export const poiService = {
  async getPOIList(params = {}) {
    const { city, type, page = 1, pageSize = 20, sortBy = 'rating' } = params
    
    let result = [...pois]
    
    if (city) {
      result = result.filter(p => p.city === city)
    }
    
    if (type) {
      result = result.filter(p => p.type === type)
    }
    
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price)
    }
    
    const total = result.length
    const start = (page - 1) * pageSize
    const list = result.slice(start, start + pageSize)
    
    return mockDelay({ list, total, page, pageSize })
  },

  async getPOIById(id) {
    const poi = dataGetPOIById(id)
    return mockDelay(poi)
  },

  async getPOIsByCity(cityId) {
    const result = dataGetPOIsByCity(cityId)
    return mockDelay(result)
  },

  async getPOIsByType(type) {
    const result = dataGetPOIsByType(type)
    return mockDelay(result)
  },

  async searchPOIs(keyword, params = {}) {
    const { city, type, limit = 20 } = params
    let result = dataSearchPOIs(keyword)
    
    if (city) {
      result = result.filter(p => p.city === city)
    }
    if (type) {
      result = result.filter(p => p.type === type)
    }
    
    return mockDelay(result.slice(0, limit))
  },

  async getHotPOIs(city, limit = 10) {
    let result = [...pois]
    if (city) {
      result = result.filter(p => p.city === city)
    }
    result.sort((a, b) => b.reviewCount - a.reviewCount)
    return mockDelay(result.slice(0, limit))
  },

  async getNearbyPOIs(lat, lng, radius = 5000, limit = 20) {
    const result = pois.map(poi => {
      const distance = Math.sqrt(
        Math.pow((poi.lat - lat) * 111000, 2) + 
        Math.pow((poi.lng - lng) * 111000 * Math.cos(lat * Math.PI / 180), 2)
      )
      return { ...poi, distance }
    }).filter(p => p.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
    
    return mockDelay(result)
  },

  async getRecommendedPOIs(city, preferences = [], limit = 10) {
    let result = city ? dataGetPOIsByCity(city) : [...pois]
    
    if (preferences.length > 0) {
      result = result.map(poi => ({
        ...poi,
        matchScore: poi.preferenceTags?.filter(tag => preferences.includes(tag)).length || 0
      })).sort((a, b) => {
        if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore
        return b.rating - a.rating
      })
    } else {
      result.sort((a, b) => b.rating - a.rating)
    }
    
    return mockDelay(result.slice(0, limit))
  },

  async getCities() {
    return mockDelay(CITIES)
  },

  async getReviews(poiId, params = {}) {
    const { page = 1, pageSize = 10 } = params
    const mockReviews = [
      { id: 'r1', userId: 'u1', userName: '旅行家小明', avatar: '', rating: 5, content: '非常棒的景点，值得一去！', images: [], createdAt: Date.now() - 86400000 },
      { id: 'r2', userId: 'u2', userName: '背包客阿杰', avatar: '', rating: 4, content: '景色很美，就是人有点多。', images: [], createdAt: Date.now() - 172800000 },
      { id: 'r3', userId: 'u3', userName: '美食达人Lily', avatar: '', rating: 5, content: '强烈推荐，来了不会后悔！', images: [], createdAt: Date.now() - 259200000 }
    ]
    return mockDelay({ list: mockReviews, total: 3, page, pageSize })
  }
}

export default poiService
