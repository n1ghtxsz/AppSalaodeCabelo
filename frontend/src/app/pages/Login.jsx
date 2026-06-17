import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RiSparklingFill, RiMailLine, RiLockLine,
  RiEyeLine, RiEyeOffLine, RiArrowLeftLine,
} from 'react-icons/ri'
import FormInput from '../components/FormInput'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../../constants'

/* ── validation ───────────────────────────────────────── */

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(email, password) {
  const e = {}
  if (!email.trim()) e.email = 'E-mail obrigatório'
  else if (!emailRe.test(email)) e.email = 'E-mail inválido'
  if (!password) e.password = 'Senha obrigatória'
  else if (password.length < 6) e.password = 'Mínimo 6 caracteres'
  else if (password !== password.trim()) e.password = 'Não pode iniciar/terminar com espaço'
  return e
}

function parseError(err) {
  if (!navigator.onLine) return 'Sem conexão com a internet.'
  if (err.message?.includes('429')) return 'Muitas tentativas. Aguarde alguns minutos.'
  if (err.message?.includes('423')) return 'Conta temporariamente bloqueada. Entre em contato.'
  return 'Credenciais inválidas. Verifique e-mail e senha.'
}

/* ── testimonial panel ────────────────────────────────── */

function TestimonialPanel() {
  return (
    <aside className="hidden lg:flex lg:w-[44%] p-6" aria-label="Depoimento de cliente">
      <div
        className="flex-1 flex flex-col justify-end p-12 relative overflow-hidden rounded-3xl"
        style={{
          background:
            'linear-gradient(175deg, #8b0847 0%, #b5175e 30%, #c41d68 55%, #8b0847 80%, #5a0630 100%)',
        }}
      >
        {/* glow orb */}
        <div
          className="absolute left-1/2 w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{
            top: '-60px',
            transform: 'translateX(-50%)',
            background:
              'radial-gradient(circle, rgba(255,180,220,0.5) 0%, rgba(232,65,156,0.4) 35%, transparent 70%)',
            filter: 'blur(30px)',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <RiSparklingFill className="text-white/70 text-xl mb-8" aria-hidden="true" />
          <blockquote>
            <p
              className="text-white text-3xl font-bold italic leading-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              "Saio do salão me sentindo outra mulher."
            </p>
            <footer className="text-white/60 text-sm mt-4">
              Leticia Borges · cliente há 4 anos
            </footer>
          </blockquote>
        </div>
      </div>
    </aside>
  )
}

/* ── social button ────────────────────────────────────── */

function SocialButton({ label, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center justify-center py-3 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
      aria-label={label}
    >
      {children}
    </button>
  )
}

/* ── icons ────────────────────────────────────────────── */

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
)

/* ── constants ────────────────────────────────────────── */

const MAX_ATTEMPTS = 5
const LOCK_SECONDS = 30

/* ── login page ───────────────────────────────────────── */

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated, loading } = useAuth()

  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [touched, setTouched]       = useState({ email: false, password: false })
  const [showPwd, setShowPwd]       = useState(false)
  const [capsLock, setCapsLock]     = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [globalError, setGlobalError] = useState(null)
  const [attempts, setAttempts]     = useState(0)
  const [lockUntil, setLockUntil]   = useState(null)
  const [lockSecs, setLockSecs]     = useState(0)

  const emailRef = useRef(null)

  // redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true })
  }, [isAuthenticated, navigate])

  // autofocus
  useEffect(() => { emailRef.current?.focus() }, [])

  // lock countdown
  useEffect(() => {
    if (!lockUntil) return
    const t = setInterval(() => {
      const rem = Math.ceil((lockUntil - Date.now()) / 1000)
      if (rem <= 0) { setLockUntil(null); setLockSecs(0); setAttempts(0) }
      else setLockSecs(rem)
    }, 1000)
    return () => clearInterval(t)
  }, [lockUntil])

  const errors  = validate(email, password)
  const isLocked = !!lockUntil && Date.now() < lockUntil

  function blur(field) {
    setTouched((p) => ({ ...p, [field]: true }))
  }

  function onCapsLock(e) {
    setCapsLock(e.getModifierState('CapsLock'))
  }

  const togglePwd = useCallback(() => setShowPwd((v) => !v), [])

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (Object.keys(errors).length || isLocked || loading) return
    setGlobalError(null)

    try {
      await login(email, password, rememberMe)
      // navegação feita pelo useEffect abaixo quando isAuthenticated muda
    } catch (err) {
      const next = attempts + 1
      setAttempts(next)
      if (next >= MAX_ATTEMPTS) setLockUntil(Date.now() + LOCK_SECONDS * 1000)
      setGlobalError(parseError(err))
    }
  }

  return (
    <div
      className="min-h-screen flex bg-white"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* ── LEFT — form ── */}
      <div className="flex-1 flex flex-col px-6 py-8 sm:px-10 lg:px-16 lg:max-w-[56%]">

        {/* header */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 lg:hidden"
            aria-label="Voltar"
          >
            <RiArrowLeftLine size={20} />
          </button>
          <a href={ROUTES.LANDING} className="flex items-center gap-2.5" aria-label="Atelier Rose">
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #e0399c 0%, #c41d68 100%)' }}
              aria-hidden="true"
            >
              <RiSparklingFill className="text-white text-base" />
            </span>
            <span className="hidden lg:block text-sm font-semibold text-gray-800">Atelier Rose</span>
          </a>
        </div>

        {/* headline */}
        <div className="mb-8">
          <h1
            className="text-[2.5rem] font-bold text-gray-900 leading-[1.1]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Bem-vinda<br />de volta.
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xs">
            Entre para gerenciar seus horários e descobrir novos serviços.
          </p>
        </div>

        {/* global error / lock */}
        {(globalError || isLocked) && (
          <div
            className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm"
            role="alert"
          >
            {isLocked
              ? `Muitas tentativas. Aguarde ${lockSecs}s para tentar novamente.`
              : globalError}
          </div>
        )}

        {/* form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <FormInput
            ref={emailRef}
            id="email"
            label="Email"
            type="email"
            placeholder="maria.fernandes@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => blur('email')}
            icon={RiMailLine}
            error={errors.email}
            touched={touched.email}
            autoComplete="email"
            inputMode="email"
            required
          />

          <div>
            <FormInput
              id="password"
              label="Senha"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => blur('password')}
              onKeyUp={onCapsLock}
              icon={RiLockLine}
              error={errors.password}
              touched={touched.password}
              autoComplete="current-password"
              required
              rightElement={
                <button
                  type="button"
                  onClick={togglePwd}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded"
                  aria-label={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPwd ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                </button>
              }
            />
            {capsLock && (
              <p className="mt-1 text-xs text-amber-500" role="status">⚠ Caps Lock ativado</p>
            )}
          </div>

          {/* remember me + forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-pink-500"
              />
              <span className="text-xs text-gray-500">Lembrar de mim</span>
            </label>
            <button
              type="button"
              onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
              className="text-xs font-medium focus:outline-none focus-visible:underline rounded"
              style={{ color: '#e0399c' }}
            >
              Esqueci a senha
            </button>
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={loading || isLocked}
            aria-busy={loading}
            className="
              w-full mt-1 py-4 rounded-full text-white text-sm font-semibold
              flex items-center justify-center gap-2
              transition-all duration-200
              hover:scale-[1.01] active:scale-[0.99]
              focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300
              disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
            "
            style={{
              background: 'linear-gradient(135deg, #f472b6 0%, #e0399c 50%, #c41d68 100%)',
            }}
          >
            {loading ? (
              <span
                className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
                aria-hidden="true"
              />
            ) : isLocked ? (
              `Aguarde ${lockSecs}s`
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* social */}
        <div className="mt-8">
          <div className="relative flex items-center gap-3" aria-hidden="true">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 whitespace-nowrap">ou continue com</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="flex gap-3 mt-4" role="group" aria-label="Login social">
            <SocialButton label="Entrar com Google"><GoogleIcon /></SocialButton>
            <SocialButton label="Entrar com Apple"><AppleIcon /></SocialButton>
          </div>
        </div>

        {/* sign up */}
        <p className="text-center text-sm text-gray-400 mt-8">
          Novo por aqui?{' '}
          <button
            onClick={() => navigate(ROUTES.REGISTER)}
            className="font-semibold focus:outline-none focus-visible:underline rounded"
            style={{ color: '#e0399c' }}
          >
            Criar conta
          </button>
        </p>
      </div>

      {/* ── RIGHT — testimonial ── */}
      <TestimonialPanel />
    </div>
  )
}
