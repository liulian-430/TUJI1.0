export const generateUUID = () => {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const generateTimestamp = () => Date.now()

export const generateRequestId = () => `req_${generateUUID()}`

export const generateSignature = (payload, secret = 'tuji_secret_key') => {
  const data = typeof payload === 'string' ? payload : JSON.stringify(payload)
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  const combined = hash.toString(16) + secret
  let finalHash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    finalHash = ((finalHash << 5) - finalHash) + char
    finalHash = finalHash & finalHash
  }
  return Math.abs(finalHash).toString(16).padStart(16, '0')
}

export const md5Hash = (str) => {
  let hash = 0
  if (str.length === 0) return hash.toString(16)
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}

export const sha256Hash = async (message) => {
  if (crypto && crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
  return md5Hash(message) + md5Hash(message.split('').reverse().join(''))
}

const AES_KEY = 'tuji_encryption_key_2026'

const simpleEncrypt = (text) => {
  if (!text) return text
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ AES_KEY.charCodeAt(i % AES_KEY.length)
    result += String.fromCharCode(charCode)
  }
  return btoa(encodeURIComponent(result))
}

const simpleDecrypt = (encrypted) => {
  if (!encrypted) return encrypted
  try {
    const decoded = decodeURIComponent(atob(encrypted))
    let result = ''
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ AES_KEY.charCodeAt(i % AES_KEY.length)
      result += String.fromCharCode(charCode)
    }
    return result
  } catch (e) {
    return encrypted
  }
}

export const encrypt = (data) => {
  try {
    const jsonStr = JSON.stringify(data)
    return simpleEncrypt(jsonStr)
  } catch (e) {
    return data
  }
}

export const decrypt = (encryptedData) => {
  try {
    const jsonStr = simpleDecrypt(encryptedData)
    return JSON.parse(jsonStr)
  } catch (e) {
    return encryptedData
  }
}

export const maskPhone = (phone) => {
  if (!phone || phone.length < 7) return phone
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}

export const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email
  const [username, domain] = email.split('@')
  if (username.length <= 2) return username[0] + '***@' + domain
  return username.slice(0, 2) + '***@' + domain
}

export const maskIdCard = (idCard) => {
  if (!idCard || idCard.length < 8) return idCard
  return idCard.slice(0, 4) + '********' + idCard.slice(-4)
}

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePhone = (phone) => {
  const regex = /^1[3-9]\d{9}$/
  return regex.test(phone)
}

export const validatePassword = (password) => {
  if (!password || password.length < 8) return { valid: false, message: '密码长度不能少于8位' }
  if (!/[a-zA-Z]/.test(password)) return { valid: false, message: '密码需要包含字母' }
  if (!/[0-9]/.test(password)) return { valid: false, message: '密码需要包含数字' }
  return { valid: true, message: '密码强度合格' }
}

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
}

export default {
  generateUUID,
  generateTimestamp,
  generateRequestId,
  generateSignature,
  md5Hash,
  sha256Hash,
  encrypt,
  decrypt,
  maskPhone,
  maskEmail,
  maskIdCard,
  validateEmail,
  validatePhone,
  validatePassword,
  sanitizeInput
}
