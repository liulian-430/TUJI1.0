import { generateUUID } from './security'

export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return '0分钟'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}分钟`
  if (mins === 0) return `${hours}小时`
  return `${hours}小时${mins}分钟`
}

export const formatCurrency = (amount, currency = 'CNY') => {
  const symbols = { CNY: '¥', USD: '$', EUR: '€', JPY: '¥' }
  const symbol = symbols[currency] || '¥'
  return `${symbol}${amount.toFixed(2)}`
}

export const formatDistance = (meters) => {
  if (meters < 1000) return `${Math.round(meters)}米`
  return `${(meters / 1000).toFixed(1)}公里`
}

export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const generateId = (prefix = 'id') => {
  return `${prefix}_${generateUUID().slice(0, 8)}`
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export const copyToClipboard = async (text) => {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (e) {
      console.error('Clipboard copy failed:', e)
    }
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  document.body.appendChild(textarea)
  textarea.select()
  const success = document.execCommand('copy')
  document.body.removeChild(textarea)
  return success
}

export const shareContent = async ({ title, text, url }) => {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
      return true
    } catch (e) {
      console.error('Share failed:', e)
      return false
    }
  }
  return false
}

export const isMobile = () => {
  return window.innerWidth < 768
}

export const isTablet = () => {
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

export const isDesktop = () => {
  return window.innerWidth >= 1024
}

export const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const randomColor = () => {
  const colors = [
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500',
    'bg-blue-500', 'bg-cyan-500', 'bg-teal-500',
    'bg-emerald-500', 'bg-green-500', 'bg-orange-500'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export default {
  formatDate,
  formatDuration,
  formatCurrency,
  formatDistance,
  calculateDistance,
  generateId,
  debounce,
  throttle,
  copyToClipboard,
  shareContent,
  isMobile,
  isTablet,
  isDesktop,
  getInitials,
  randomColor
}
