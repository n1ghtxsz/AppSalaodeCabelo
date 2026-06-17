import { api } from './api'
import { storage } from '../utils/storage'

export const authService = {
  async login(email, password, persist = false) {
    const data = await api.post('/auth/login', { email, password })
    storage.setToken(data.token, persist)
    storage.setUser(data.user, persist)
    return data
  },

  async register(payload) {
    const data = await api.post('/auth/register', payload)
    storage.setToken(data.token)
    storage.setUser(data.user)
    return data
  },

  logout() {
    storage.clear()
  },

  isAuthenticated: () => !!storage.getToken(),
}
