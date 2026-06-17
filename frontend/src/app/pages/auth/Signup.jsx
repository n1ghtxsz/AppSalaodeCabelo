import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RiSparklingFill,
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
  RiArrowLeftLine,
  RiUserLine,
  RiPhoneLine,
  RiCheckLine,
  RiCloseLine,
} from 'react-icons/ri'
import FormInput from '../../components/FormInput'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../../constants'

/* ── phone mask ───────────────────────────────────────────── */
const formatPhone = (val) => {
  const d = val.replace(/\D/g, '')
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`
}

/* ── validation ───────────────────────────────────────────── */
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRe = /^\(\d{2}\)\s\d{5}-\d{4}$/

function validate(data) {
  const e = {}
  if (!data.name.trim())
    e.name = 'Nome completo é obrigatório'

  if (!data.phone.trim())
    e.phone = 'Telefone é obrigatório'
  else if (!phoneRe.test(data.phone))
    e.phone = 'Formato inválido — use (11) 99999-9999'

  if (!data.email.trim())
    e.email = 'E-mail é obrigatório'
  else if (!emailRe.test(data.email))
    e.email = 'E-mail inválido'

  if (!data.password)
    e.password = 'Senha é obrigatória'
  else if (data.password.length < 8)
    e.password = 'Mínimo de 8 caracteres'
  else if (!/[A-Z]/.test(data.password))
    e.password = 'Pelo menos 1 letra maiúscula'
  else if (!/[0-9]/.test(data.password))
    e.password = 'Pelo menos 1 número'
  else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password))
    e.password = 'Pelo menos 1 caractere especial'

  if (!data.confirmPassword)
    e.confirmPassword = 'Confirmação de senha é obrigatória'
  else if (data.password !== data.confirmPassword)
    e.confirmPassword = 'As senhas não coincidem'

  if (!data.acceptTerms)
    e.acceptTerms = 'Aceite os Termos e a Política de Privacidade'

  return e
}

/* ── password rule row ────────────────────────────────────── */
function PwdRule({ text, ok }) {
  return (
    <div className="flex items-center gap-1.5 text-xs transition-colors duration-150">
      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border ${
        ok ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-gray-50 border-gray-200 text-gray-300'
      }`}>
        <RiCheckLine size={10} />
      </span>
      <span className={ok ? 'text-emerald-600 font-medium' : 'text-gray-400'}>{text}</span>
    </div>
  )
}

/* ── testimonial panel ────────────────────────────────────── */
function TestimonialPanel() {
  return (
    <aside className="hidden lg:flex lg:w-[44%] p-6" aria-label="Depoimento">
      <div
        className="flex-1 flex flex-col justify-end p-12 relative overflow-hidden rounded-3xl"
        style={{ background: 'linear-gradient(175deg, #8b0847 0%, #b5175e 30%, #c41d68 55%, #8b0847 80%, #5a0630 100%)' }}
      >
        <div
          className="absolute left-1/2 w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{
            top: '-60px',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(255,180,220,0.5) 0%, rgba(232,65,156,0.4) 35%, transparent 70%)',
            filter: 'blur(30px)',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <RiSparklingFill className="text-white/70 text-xl mb-8" aria-hidden="true" />
          <blockquote>
            <p className="text-white text-3xl font-bold italic leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              "Agendei, fui, saí renovada. Simples assim."
            </p>
            <footer className="text-white/60 text-sm mt-4">
              Simone Medeiros · cliente há 2 anos
            </footer>
          </blockquote>
        </div>
      </div>
    </aside>
  )
}

/* ── Signup ───────────────────────────────────────────────── */
export default function Signup() {
  const navigate = useNavigate()
  const { register, loading, isAuthenticated } = useAuth()

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', password: '', confirmPassword: '', acceptTerms: false,
  })
  const [touched, setTouched]         = useState({})
  const [showPwd, setShowPwd]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [toast, setToast]             = useState(null)

  const nameRef = useRef(null)

  useEffect(() => { if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true }) }, [isAuthenticated, navigate])
  useEffect(() => { nameRef.current?.focus() }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  const errors = validate(formData)

  const set = (field, val) =>
    setFormData((p) => ({ ...p, [field]: field === 'phone' ? formatPhone(val) : val }))

  const blur = (field) => setTouched((p) => ({ ...p, [field]: true }))

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched({ name: true, phone: true, email: true, password: true, confirmPassword: true, acceptTerms: true })
    if (Object.keys(errors).length) return

    try {
      setToast(null)
      await register({
        name:            formData.name,
        email:           formData.email,
        password:        formData.password,
        confirmPassword: formData.confirmPassword,
        phone:           formData.phone,
      })

      setToast({ type: 'success', message: 'Conta criada com sucesso! Redirecionando...' })
      setTimeout(() => navigate(ROUTES.DASHBOARD, { replace: true }), 1500)
    } catch (err) {
      const msg = err.message || ''
      const friendly = msg.toLowerCase().includes('rate limit') || msg.includes('429')
        ? 'Limite de cadastros atingido. Aguarde alguns minutos e tente novamente.'
        : msg.toLowerCase().includes('already registered')
        ? 'Este e-mail já está cadastrado.'
        : msg || 'Ocorreu um erro ao criar a conta.'
      setToast({ type: 'error', message: friendly })
    }
  }

  const pwd = formData.password
  const pwdRules = [
    { text: 'Mínimo de 8 caracteres',   ok: pwd.length >= 8 },
    { text: '1 letra maiúscula',         ok: /[A-Z]/.test(pwd) },
    { text: '1 número',                  ok: /[0-9]/.test(pwd) },
    { text: '1 caractere especial',      ok: /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ]

  return (
    <div
      className="min-h-screen flex bg-white"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* ── toast ── */}
      {toast && (
        <div
          role="alert"
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 max-w-[90%] md:max-w-md ${
            toast.type === 'success'
              ? 'bg-emerald-50 border border-emerald-100 text-emerald-800'
              : 'bg-rose-50 border border-rose-100 text-rose-800'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
            toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
          }`}>
            {toast.type === 'success' ? '✓' : '!'}
          </span>
          <p className="text-xs md:text-sm font-semibold flex-1">{toast.message}</p>
          <button onClick={() => setToast(null)} aria-label="Fechar" className="text-gray-400 hover:text-gray-600">
            <RiCloseLine size={16} />
          </button>
        </div>
      )}

      {/* ── LEFT — form ── */}
      <div className="flex-1 flex flex-col px-6 py-8 sm:px-10 lg:px-16 lg:max-w-[56%] overflow-y-auto">
        <div className="w-full max-w-md lg:max-w-[440px] mx-auto flex flex-col my-auto py-6">

          {/* header */}
          <div className="flex items-center gap-3 mb-10">
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="p-2 -ml-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
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
            <h1 className="text-[2.5rem] font-bold text-gray-900 leading-[1.1]" style={{ fontFamily: 'var(--font-serif)' }}>
              Criar conta
            </h1>
            <p className="text-sm text-gray-400 mt-2">Preencha os dados para começar a agendar.</p>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <FormInput
              ref={nameRef}
              id="name" label="Nome completo" type="text"
              placeholder="Maria Fernandes"
              value={formData.name}
              onChange={(e) => set('name', e.target.value)}
              onBlur={() => blur('name')}
              icon={RiUserLine}
              error={errors.name} touched={touched.name}
              autoComplete="name" required
            />

            <FormInput
              id="phone" label="Telefone" type="tel"
              placeholder="(11) 98456-2210"
              value={formData.phone}
              onChange={(e) => set('phone', e.target.value)}
              onBlur={() => blur('phone')}
              icon={RiPhoneLine}
              error={errors.phone} touched={touched.phone}
              autoComplete="tel" inputMode="tel" required
            />

            <FormInput
              id="email" label="Email" type="email"
              placeholder="maria.fernandes@gmail.com"
              value={formData.email}
              onChange={(e) => set('email', e.target.value)}
              onBlur={() => blur('email')}
              icon={RiMailLine}
              error={errors.email} touched={touched.email}
              autoComplete="email" inputMode="email" required
            />

            {/* password + rules */}
            <div>
              <FormInput
                id="password" label="Senha"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => set('password', e.target.value)}
                onBlur={() => blur('password')}
                icon={RiLockLine}
                error={errors.password} touched={touched.password}
                autoComplete="new-password" required
                rightElement={
                  <button type="button" onClick={() => setShowPwd((v) => !v)}
                    className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded p-1"
                    aria-label={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPwd ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                  </button>
                }
              />
              {formData.password && (
                <div className="mt-2 p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-1.5">
                  {pwdRules.map((r) => <PwdRule key={r.text} text={r.text} ok={r.ok} />)}
                </div>
              )}
            </div>

            <FormInput
              id="confirmPassword" label="Confirmar senha"
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => set('confirmPassword', e.target.value)}
              onBlur={() => blur('confirmPassword')}
              icon={RiLockLine}
              error={errors.confirmPassword} touched={touched.confirmPassword}
              autoComplete="new-password" required
              rightElement={
                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded p-1"
                  aria-label={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                >
                  {showConfirm ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                </button>
              }
            />

            {/* terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <div className="relative flex items-center shrink-0 mt-0.5">
                  <input
                    type="checkbox" id="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData((p) => ({ ...p, acceptTerms: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded-lg border border-gray-200 bg-white transition-all duration-150 peer-checked:bg-pink-500 peer-checked:border-pink-500 peer-focus-visible:ring-2 peer-focus-visible:ring-pink-300 flex items-center justify-center text-white">
                    <RiCheckLine size={14} />
                  </div>
                </div>
                <span className="text-xs text-gray-500 leading-normal">
                  Aceito os{' '}
                  <a href="/termos" target="_blank" className="font-semibold text-pink-500 hover:underline">Termos</a>
                  {' '}e a{' '}
                  <a href="/privacidade" target="_blank" className="font-semibold text-pink-500 hover:underline">Política de Privacidade</a>.
                </span>
              </label>
              {touched.acceptTerms && errors.acceptTerms && (
                <p className="mt-1 text-xs text-red-500" role="alert">{errors.acceptTerms}</p>
              )}
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="
                w-full mt-2 py-4 rounded-full text-white text-sm font-semibold
                flex items-center justify-center gap-2
                transition-all duration-200
                hover:scale-[1.01] active:scale-[0.99]
                focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300
                disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
              "
              style={{ background: 'linear-gradient(135deg, #f472b6 0%, #e0399c 50%, #c41d68 100%)' }}
            >
              {loading
                ? <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" aria-hidden="true" />
                : <><span>Criar conta</span><RiSparklingFill size={15} /></>
              }
            </button>
          </form>

          {/* login link */}
          <p className="text-center text-sm text-gray-400 mt-8">
            Já tem conta?{' '}
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="font-semibold focus:outline-none focus-visible:underline rounded"
              style={{ color: '#e0399c' }}
            >
              Entrar
            </button>
          </p>
        </div>
      </div>

      {/* ── RIGHT — testimonial ── */}
      <TestimonialPanel />
    </div>
  )
}
