import useUserStore from '../store/useUserStore'
import useTripStore from '../store/useTripStore'

const mockDelay = (data, delay = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

export const userService = {
  async getProfile() {
    const user = useUserStore.getState().user
    return mockDelay(user)
  },

  async updateProfile(updates) {
    useUserStore.getState().updateProfile(updates)
    const updatedUser = useUserStore.getState().user
    return mockDelay(updatedUser)
  },

  async getSettings() {
    const settings = useUserStore.getState().settings
    return mockDelay(settings)
  },

  async updateSettings(settings) {
    useUserStore.getState().updateSettings(settings)
    const updatedSettings = useUserStore.getState().settings
    return mockDelay(updatedSettings)
  },

  async getFavorites() {
    const favoriteIds = useTripStore.getState().favorites
    return mockDelay(favoriteIds)
  },

  async addFavorite(poiId) {
    useTripStore.getState().addFavorite(poiId)
    return mockDelay({ success: true })
  },

  async removeFavorite(poiId) {
    useTripStore.getState().removeFavorite(poiId)
    return mockDelay({ success: true })
  },

  async getFootprint() {
    const footprint = useUserStore.getState().footprint
    return mockDelay(footprint)
  },

  async addFootprint(city, date) {
    const fp = useUserStore.getState().addFootprint(city, date)
    return mockDelay(fp)
  },

  async getMyTrips(params = {}) {
    const trips = useTripStore.getState().trips
    return mockDelay(trips)
  },

  async getUserStats() {
    const user = useUserStore.getState().user
    const trips = useTripStore.getState().trips
    const footprint = useUserStore.getState().footprint
    const cities = new Set(footprint.map(fp => fp.city))

    return mockDelay({
      tripsCount: trips.length,
      footprintCount: footprint.length,
      citiesCount: cities.size,
      level: user?.level || 1,
      exp: user?.exp || 0,
      nextLevelExp: 1000
    })
  },

  async uploadAvatar(file) {
    return mockDelay({
      success: true,
      url: URL.createObjectURL(file)
    })
  },

  async changePassword(oldPassword, newPassword) {
    if (!oldPassword || !newPassword) {
      return { success: false, message: '请输入密码' }
    }
    return mockDelay({ success: true, message: '密码修改成功' })
  },

  async bindPhone(phone, code) {
    return mockDelay({ success: true, message: '绑定成功' })
  },

  async bindEmail(email, code) {
    return mockDelay({ success: true, message: '绑定成功' })
  },

  async deleteAccount() {
    return mockDelay({ success: true, message: '账号已注销' })
  }
}

export default userService
