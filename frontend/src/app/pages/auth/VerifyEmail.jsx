import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiMailOpenLine, RiArrowRightLine, RiCloseLine } from 'react-icons/ri'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const [resending, setResending] = useState(false)
  const [toast, setToast] = useState(null)

  const handleResend = async () => {
    setResending(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setToast({
        type: 'success',
        message: 'Novo link de verificação enviado! Por favor, cheque sua caixa de entrada.',
      })
    } catch (err) {
      setToast({
        type: 'error',
        message: 'Erro ao reajustar o envio. Tente novamente mais tarde.',
      })
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12 relative">
      {toast && (
        <div
          role="alert"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-800 max-w-[90%] md:max-w-md animate-bounce"
        >
          <p className="text-xs md:text-sm font-semibold">{toast.message}</p>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 focus:outline-none ml-auto">
            <RiCloseLine size={16} />
          </button>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-xl text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-3xl bg-pink-50 flex items-center justify-center text-pink-500 mb-6 shadow-inner">
          <RiMailOpenLine size={32} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 font-serif leading-tight">Confirme seu e-mail</h1>
        <p className="text-sm text-gray-400 mt-3 mb-6 max-w-xs leading-relaxed">
          Enviamos um link de confirmação para o seu endereço de e-mail. Por favor, acesse-o para ativar sua conta.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-4 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] focus:outline-none bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 shadow-md cursor-pointer"
        >
          <span>Ir para o Painel</span>
          <RiArrowRightLine size={16} />
        </button>

        <p className="text-xs text-gray-400 mt-6">
          Não recebeu o e-mail?{' '}
          <button
            onClick={handleResend}
            disabled={resending}
            className="font-bold text-pink-500 hover:underline focus:outline-none disabled:opacity-60"
          >
            {resending ? 'Reenviando...' : 'Reenviar link'}
          </button>
        </p>
      </div>
    </div>
  )
}
