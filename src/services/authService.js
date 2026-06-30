import useUserStore from '../store/useUserStore'
import { sha256Hash, validateEmail, validatePhone, validatePassword } from '../utils/security'
import { generateId } from '../utils/helpers'

const mockDelay = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

export const authService = {
  async login({ email, password }) {
    if (!email || !password) {
      return { success: false, message: '请输入邮箱和密码' }
    }
    if (!validateEmail(email)) {
      return { success: false, message: '邮箱格式不正确' }
    }

    const result = await useUserStore.getState().login(email, password)
    return mockDelay(result)
  },

  async register({ email, password, nickname, phone }) {
    if (!email || !password) {
      return { success: false, message: '请输入邮箱和密码' }
    }
    if (!validateEmail(email)) {
      return { success: false, message: '邮箱格式不正确' }
    }
    const passwordCheck = validatePassword(password)
    if (!passwordCheck.valid) {
      return { success: false, message: passwordCheck.message }
    }
    if (phone && !validatePhone(phone)) {
      return { success: false, message: '手机号格式不正确' }
    }

    const result = await useUserStore.getState().register(email, password, nickname)
    return mockDelay(result)
  },

  async logout() {
    useUserStore.getState().logout()
    return mockDelay({ success: true })
  },

  async sendVerifyCode(emailOrPhone) {
    if (!emailOrPhone) {
      return { success: false, message: '请输入邮箱或手机号' }
    }
    return mockDelay({ success: true, message: '验证码已发送' })
  },

  async verifyCode(emailOrPhone, code) {
    if (!code || code.length < 4) {
      return { success: false, message: '验证码不正确' }
    }
    return mockDelay({ success: true })
  },

  async resetPassword(email, newPassword, code) {
    if (!validateEmail(email)) {
      return { success: false, message: '邮箱格式不正确' }
    }
    const passwordCheck = validatePassword(newPassword)
    if (!passwordCheck.valid) {
      return { success: false, message: passwordCheck.message }
    }
    return mockDelay({ success: true, message: '密码重置成功' })
  },

  async refreshToken() {
    const currentToken = useUserStore.getState().token
    if (!currentToken) {
      return { success: false, message: '未登录' }
    }
    const newToken = 'mock_refreshed_token_' + generateId()
    useUserStore.getState().updateProfile({})
    return mockDelay({ success: true, token: newToken })
  },

  async checkAuth() {
    const isAuth = useUserStore.getState().isAuthenticated()
    return mockDelay({ isAuthenticated: isAuth })
  }
}

export default authService
