import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './app/context/auth/AuthContext'
import { lazy, Suspense } from 'react'
import { ROUTES } from './constants'
import { PrivateRoute, PublicRoute } from './app/routes'

const Landing = lazy(() => import('./landing/HomePage'))
const Welcome = lazy(() => import('./app/pages/Welcome'))
const AppHome = lazy(() => import('./app/pages/Home'))
const Login = lazy(() => import('./app/pages/Login'))
const Signup = lazy(() => import('./app/pages/auth/Signup'))
const ForgotPassword = lazy(() => import('./app/pages/auth/ForgotPassword'))
const VerifyEmail = lazy(() => import('./app/pages/auth/VerifyEmail'))
const Dashboard = lazy(() => import('./app/pages/Dashboard'))
const Schedule  = lazy(() => import('./app/pages/Schedule'))
const Agenda    = lazy(() => import('./app/pages/Agenda'))
const History   = lazy(() => import('./app/pages/History'))
const Profile   = lazy(() => import('./app/pages/Profile'))

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#5a0630' }}>
      <span className="w-6 h-6 rounded-full border-2 border-white/40 border-t-white animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public */}
            <Route path={ROUTES.LANDING} element={<Landing />} />
            <Route path={ROUTES.APP_HOME} element={<Welcome />} />
            <Route path="/mobile" element={<AppHome />} />

            {/* Guest-only (redirect to dashboard if authenticated) */}
            <Route path={ROUTES.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />
            <Route path={ROUTES.REGISTER} element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path={ROUTES.VERIFY_EMAIL} element={<PublicRoute><VerifyEmail /></PublicRoute>} />

            {/* Private (redirect to login if not authenticated) */}
            <Route path={ROUTES.DASHBOARD} element={<PrivateRoute><Dashboard /></PrivateRoute>} />

            {/* Private */}
            <Route path={ROUTES.SCHEDULE} element={<PrivateRoute><Schedule /></PrivateRoute>} />
            <Route path={ROUTES.AGENDA}   element={<PrivateRoute><Agenda /></PrivateRoute>} />
            <Route path={ROUTES.HISTORY}  element={<PrivateRoute><History /></PrivateRoute>} />
            <Route path={ROUTES.PROFILE}  element={<PrivateRoute><Profile /></PrivateRoute>} />

            <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
