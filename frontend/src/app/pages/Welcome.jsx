import { RiSparklingFill, RiStarFill, RiMenuLine, RiCloseLine } from 'react-icons/ri'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants'

/* ── navbar interna do sistema ────────────────────────── */

function AppNavbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="relative flex items-center justify-between px-8 pt-6 pb-4" aria-label="Navegação">
      <span
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'linear-gradient(135deg, #e0399c 0%, #c41d68 100%)' }}
        aria-hidden="true"
      >
        <RiSparklingFill className="text-white text-base" />
      </span>

      <ul className="hidden md:flex items-center gap-8" role="list">
        {[{ label: 'Atendimentos', href: '#' }, { label: 'Contato', href: '#' }].map(({ label, href }) => (
          <li key={label}>
            <a href={href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150 font-medium">
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={() => navigate(ROUTES.LOGIN)}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-150 px-2"
        >
          Entrar
        </button>
        <button
          onClick={() => navigate(ROUTES.SCHEDULE)}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Agendar agora
        </button>
      </div>

      <button
        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
      >
        {open ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg px-8 py-6 flex flex-col gap-5 z-50 md:hidden">
          <button onClick={() => { navigate(ROUTES.LOGIN); setOpen(false) }} className="text-sm text-gray-600 font-medium text-left">Entrar</button>
          <button
            onClick={() => { navigate(ROUTES.SCHEDULE); setOpen(false) }}
            className="inline-flex items-center justify-center bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-full"
          >
            Agendar agora
          </button>
        </div>
      )}
    </nav>
  )
}

/* ── floating cards (painel direito) ──────────────────── */

function StatusCard() {
  return (
    <div className="absolute top-[12%] right-6 lg:right-10 w-52 bg-white rounded-2xl shadow-xl p-4 z-10">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Agora atendendo</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
      </div>
      <p className="text-sm font-bold text-gray-900 mt-1">Corte + Escova</p>
      <p className="text-xs text-gray-400 mt-0.5">Salão · Sala 02</p>
      <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: '65%', background: 'linear-gradient(90deg, #e0399c, #c41d68)' }}
          role="progressbar" aria-valuenow={65} aria-valuemin={0} aria-valuemax={100}
        />
      </div>
    </div>
  )
}

function ProfileCard() {
  return (
    <div className="absolute bottom-[14%] left-6 lg:left-10 w-56 bg-white rounded-2xl shadow-xl p-4 z-10">
      <div className="flex items-center gap-3 mb-3">
        <span
          className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #f06cba 0%, #c41d68 100%)' }}
        >
          CR
        </span>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-none">Camila Rocha</p>
          <p className="text-xs text-gray-400 mt-0.5">Colorista premiada</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">Próximo horário</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(224,57,156,0.1)', color: '#c41d68' }}>
          Hoje · 14:30
        </span>
      </div>
    </div>
  )
}

function ColorSwatches() {
  return (
    <div className="absolute bottom-[6%] left-6 lg:left-10 flex gap-2 z-10" aria-hidden="true">
      {['#f9a8d4', '#e0399c', '#a855a0', '#7c3070'].map((color) => (
        <span
          key={color}
          className="w-9 h-9 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-150"
          style={{ background: color }}
        />
      ))}
    </div>
  )
}

/* ── stats ────────────────────────────────────────────── */

const STATS = [
  { value: '12+', label: 'anos de história' },
  { value: '4.9', label: 'no Google · 800+ avaliações', star: true },
  { value: '8', label: 'profissionais premiadas' },
]

/* ── welcome page ─────────────────────────────────────── */

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <section className="flex min-h-screen" aria-labelledby="welcome-heading">
      {/* ── LEFT — white ── */}
      <div className="relative flex flex-col bg-white w-full lg:w-[58%]">
        <AppNavbar />

        <div className="flex-1 flex flex-col justify-center px-8 md:px-14 lg:px-16 pb-12 pt-4">
          {/* News badge */}
          <div
            className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full mb-8 text-xs font-medium"
            style={{ background: 'rgba(224,57,156,0.08)', border: '1px solid rgba(224,57,156,0.2)', color: '#b5175e' }}
          >
            <RiSparklingFill className="text-xs shrink-0" aria-hidden="true" />
            Novos horários abertos para junho
          </div>

          {/* Headline */}
          <h1 id="welcome-heading" className="leading-[1.05] mb-6">
            <span className="block text-4xl md:text-5xl lg:text-6xl font-black text-gray-900" style={{ fontFamily: 'var(--font-sans)' }}>
              Beleza com<br />hora certa,
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl font-bold italic mt-1" style={{ fontFamily: 'var(--font-serif)', color: '#e0399c' }}>
              e sem espera.
            </span>
          </h1>

          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-sm mb-8">
            Cortes, coloração, manicure e maquiagem nas mãos de profissionais
            selecionadas. Agendamento em menos de 1 minuto, direto pelo celular.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate(ROUTES.SCHEDULE)}
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-300"
              style={{ background: 'linear-gradient(135deg, #e0399c 0%, #c41d68 100%)' }}
            >
              <RiSparklingFill className="text-sm" aria-hidden="true" />
              Agendar agora
            </button>
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 px-6 py-3.5 rounded-full border border-gray-200 hover:border-gray-300 transition-all duration-200"
            >
              Ver serviços
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 pt-8 mt-8 border-t border-gray-100">
            {STATS.map(({ value, label, star }, i) => (
              <div key={label} className="flex items-center gap-6">
                {i > 0 && <div className="w-px h-8 bg-gray-200 shrink-0" aria-hidden="true" />}
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-gray-900 leading-none">{value}</span>
                    {star && <RiStarFill className="text-amber-400 text-sm mb-0.5" aria-hidden="true" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-tight">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT — pink gradient ── */}
      <div className="relative hidden lg:block lg:flex-1 overflow-hidden">
        {/* gradient */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(175deg, #8b0847 0%, #b5175e 30%, #c41d68 55%, #8b0847 80%, #5a0630 100%)' }} />
        {/* glow orb */}
        <div
          className="absolute left-1/2 w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{
            top: '-40px',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(255,180,220,0.5) 0%, rgba(232,65,156,0.4) 35%, rgba(194,24,91,0.15) 60%, transparent 75%)',
            filter: 'blur(30px)',
          }}
          aria-hidden="true"
        />
        <StatusCard />
        <ProfileCard />
        <ColorSwatches />
      </div>
    </section>
  )
}
