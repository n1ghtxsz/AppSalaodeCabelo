import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Wrapper to protect routes requiring authentication
export function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="w-8 h-8 rounded-full border-2 border-pink-500/40 border-t-pink-500 animate-spin" />
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Wrapper to protect routes that should only be visible to guests (e.g. Login, Signup)
export function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="w-8 h-8 rounded-full border-2 border-pink-500/40 border-t-pink-500 animate-spin" />
      </div>
    )
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}
