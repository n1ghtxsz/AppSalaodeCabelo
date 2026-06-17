import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { api, setAccessToken } from '../../services/api'
import { storage } from '../../../utils/storage'

const AuthContext = createContext(null)

function normalizeUser(authUser, profile) {
  return {
    id:    authUser.id,
    email: authUser.email,
    name:  profile?.fullName || authUser.user_metadata?.full_name || '',
    phone: profile?.phone || '',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(storage.getUser)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password, persist = false) => {
    setLoading(true)
    try {
      const { session, user: authUser, profile } = await api.post('/auth/login', { email, password })
      setAccessToken(session.access_token)
      const normalized = normalizeUser(authUser, profile)
      storage.setUser(normalized, persist)
      setUser(normalized)
      return { session, user: normalized }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const { session, user: authUser, profile } = await api.post('/auth/register', payload)
      if (!session) throw new Error('Confirmação de e-mail ativa no Supabase. Desative em Authentication → Email → Confirm email.')
      setAccessToken(session.access_token)
      const normalized = normalizeUser(authUser, profile)
      storage.setUser(normalized, false)
      setUser(normalized)
      return { session, user: authUser }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setAccessToken(null)
    storage.clear()
    setUser(null)
  }, [])

  useEffect(() => {
    const onUnauthorized = () => logout()
    window.addEventListener('auth:unauthorized', onUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized)
  }, [logout])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
