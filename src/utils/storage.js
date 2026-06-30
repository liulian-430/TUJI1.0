const PREFIX = 'tuji_'

export const storageKeys = {
  TRIP_DATA: `${PREFIX}trip_data`,
  UI_DATA: `${PREFIX}ui_data`,
  USER_DATA: `${PREFIX}user_data`,
  SEARCH_HISTORY: `${PREFIX}search_history`,
  FAVORITES: `${PREFIX}favorites`,
  AUTH_TOKEN: `${PREFIX}auth_token`,
  DATA_VERSION: `${PREFIX}data_version`,
  LAST_UPDATE_CHECK: `${PREFIX}last_update_check`
}

export const setStorage = (key, value) => {
  try {
    const jsonValue = JSON.stringify(value)
    localStorage.setItem(key, jsonValue)
    return true
  } catch (e) {
    console.error('Storage set error:', e)
    return false
  }
}

export const getStorage = (key, defaultValue = null) => {
  try {
    const jsonValue = localStorage.getItem(key)
    if (jsonValue === null) return defaultValue
    return JSON.parse(jsonValue)
  } catch (e) {
    console.error('Storage get error:', e)
    return defaultValue
  }
}

export const removeStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (e) {
    console.error('Storage remove error:', e)
    return false
  }
}

export const clearStorage = () => {
  try {
    Object.values(storageKeys).forEach(key => {
      localStorage.removeItem(key)
    })
    return true
  } catch (e) {
    console.error('Storage clear error:', e)
    return false
  }
}

export const setSessionStorage = (key, value) => {
  try {
    const jsonValue = JSON.stringify(value)
    sessionStorage.setItem(key, jsonValue)
    return true
  } catch (e) {
    console.error('Session storage set error:', e)
    return false
  }
}

export const getSessionStorage = (key, defaultValue = null) => {
  try {
    const jsonValue = sessionStorage.getItem(key)
    if (jsonValue === null) return defaultValue
    return JSON.parse(jsonValue)
  } catch (e) {
    console.error('Session storage get error:', e)
    return defaultValue
  }
}

export const getStorageSize = () => {
  let total = 0
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length * 2
    }
  }
  return {
    bytes: total,
    kb: (total / 1024).toFixed(2),
    mb: (total / (1024 * 1024)).toFixed(2)
  }
}

export default {
  storageKeys,
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  setSessionStorage,
  getSessionStorage,
  getStorageSize
}
