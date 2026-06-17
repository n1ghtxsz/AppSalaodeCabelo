import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiMailLine, RiArrowLeftLine, RiSendPlaneLine, RiCloseLine } from 'react-icons/ri'
import FormInput from '../../components/FormInput'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  
  const emailRef = useRef(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const error = !email.trim() ? 'E-mail é obrigatório' : !emailRe.test(email) ? 'E-mail inválido' : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (error) return

    setLoading(true)
    try {
      // Simulate real API integration
      await new Promise(resolve => setTimeout(resolve, 1500))
      setToast({
        type: 'success',
        message: 'Instruções de recuperação enviadas para o seu e-mail!',
      })
      setEmail('')
      setTouched(false)
    } catch (err) {
      setToast({
        type: 'error',
        message: 'Ocorreu um erro ao enviar o e-mail de recuperação.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12 relative">
      {toast && (
        <div
          role="alert"
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 transition-all duration-300 max-w-[90%] md:max-w-md ${
            toast.type === 'success'
              ? 'bg-emerald-50 border border-emerald-100 text-emerald-800'
              : 'bg-rose-50 border border-rose-100 text-rose-800'
          }`}
        >
          <p className="text-xs md:text-sm font-semibold">{toast.message}</p>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 focus:outline-none ml-auto">
            <RiCloseLine size={16} />
          </button>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-xl">
        <button
          onClick={() => navigate('/login')}
          className="p-2.5 rounded-full text-gray-500 hover:text-gray-900 border border-gray-100 hover:bg-gray-50 transition-all duration-150 focus:outline-none mb-6"
          aria-label="Voltar para Login"
        >
          <RiArrowLeftLine size={16} />
        </button>

        <h1 className="text-2xl font-bold text-gray-900 font-serif leading-tight">Recuperar senha</h1>
        <p className="text-sm text-gray-400 mt-2 mb-8">
          Digite seu e-mail registrado. Nós lhe enviaremos as instruções para redefinir sua senha.
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <FormInput
            ref={emailRef}
            id="email"
            label="Email"
            type="email"
            placeholder="maria.fernandes@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            icon={RiMailLine}
            error={error}
            touched={touched}
            autoComplete="email"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] focus:outline-none bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 shadow-md disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <>
                <span>Enviar Instruções</span>
                <RiSendPlaneLine size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
