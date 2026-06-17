import { useMemo }            from 'react'
import { useNavigate }         from 'react-router-dom'
import {
  RiSettings3Line,
  RiUserLine, RiHeartLine,
  RiNotification3Line, RiLockLine,
  RiArrowRightSLine, RiLogoutBoxRLine,
  RiSparklingFill, RiStarFill,
} from 'react-icons/ri'
import { useAuth }         from '../hooks/useAuth'
import { useAppointments } from '../hooks/useAppointments'
import AppSidebar          from '../components/AppSidebar'
import BottomNav           from '../components/BottomNav'
import { ROUTES }          from '../../constants'

/* ── menu config ─────────────────────────────────────────── */

const MENU = [
  { icon: RiUserLine,            label: 'Dados pessoais',  description: 'Nome, telefone e foto' },
  { icon: RiHeartLine,           label: 'Favoritos',       description: 'Profissionais e serviços' },
  { icon: RiNotification3Line,   label: 'Notificações',    description: 'Lembretes e alertas' },
  { icon: RiLockLine,            label: 'Segurança',       description: 'Senha e privacidade' },
]

/* ── sub-components ──────────────────────────────────────── */

function Avatar({ initials }) {
  return (
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-pink-100"
      style={{ background: 'linear-gradient(135deg, #fda4af 0%, #ec4899 100%)' }}
    >
      {initials}
    </div>
  )
}

function VipBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
      style={{ background: 'linear-gradient(135deg, #f472b6 0%, #e0399c 100%)' }}
    >
      <RiSparklingFill size={11} />
      Cliente VIP
    </span>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 py-4 flex flex-col items-center shadow-sm">
      <span className="text-xl font-bold text-gray-900 leading-none">{value}</span>
      <span className="text-[11px] text-gray-400 mt-1 text-center leading-tight">{label}</span>
    </div>
  )
}

function MenuItem({ icon: Icon, label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 w-full bg-white rounded-2xl border border-gray-100 px-4 py-3.5 text-left hover:border-gray-200 hover:shadow-sm transition-all duration-150 active:scale-[0.99]"
    >
      <span className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center shrink-0">
        <Icon size={18} style={{ color: '#e0399c' }} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <RiArrowRightSLine size={18} className="text-gray-300 shrink-0" />
    </button>
  )
}

function LogoutButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 w-full bg-white rounded-2xl border border-gray-100 px-4 py-3.5 text-left hover:border-red-100 hover:bg-red-50/30 transition-all duration-150 active:scale-[0.99]"
    >
      <span className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
        <RiLogoutBoxRLine size={18} className="text-red-400" />
      </span>
      <span className="text-sm font-semibold text-red-500">Sair</span>
    </button>
  )
}

/* ── page ────────────────────────────────────────────────── */

export default function Profile() {
  const navigate            = useNavigate()
  const { user, logout }    = useAuth()
  const { appointments }    = useAppointments()

  const initials  = user?.name
    ?.split(' ').filter(Boolean).map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'U'

  const stats = useMemo(() => {
    const completed = appointments.filter((a) => a.status === 'completed').length
    const isVip     = completed >= 10
    return { atendimentos: completed, isVip }
  }, [appointments])

  function handleLogout() {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">

        {/* header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-30 px-4 md:px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-serif)' }}>
            Perfil
          </h1>
          <button
            className="p-2 rounded-full hover:bg-gray-50 text-gray-500 transition-colors"
            aria-label="Configurações"
          >
            <RiSettings3Line size={20} />
          </button>
        </header>

        {/* content */}
        <main
          className="flex-1 overflow-y-auto px-4 md:px-6 py-6"
          style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-lg mx-auto flex flex-col gap-5">

            {/* avatar + info */}
            <div className="flex flex-col items-center gap-2 pt-2 pb-1">
              <Avatar initials={initials} />
              <div className="text-center mt-1">
                <p className="text-lg font-bold text-gray-900">{user?.name || 'Usuária'}</p>
                <p className="text-sm text-gray-400 mt-0.5">{user?.email || ''}</p>
              </div>
              {stats.isVip && (
                <div className="mt-1">
                  <VipBadge />
                </div>
              )}
            </div>

            {/* stats */}
            <div className="flex gap-3">
              <StatCard value={stats.atendimentos} label="Atendimentos" />
              <StatCard value="4.9"                label="Sua avaliação" />
              <StatCard value="8"                  label="Favoritos" />
            </div>

            {/* menu */}
            <div className="flex flex-col gap-2.5">
              {MENU.map(({ icon, label, description }) => (
                <MenuItem
                  key={label}
                  icon={icon}
                  label={label}
                  description={description}
                  onClick={() => {}}
                />
              ))}
            </div>

            {/* logout */}
            <LogoutButton onClick={handleLogout} />

            {/* version */}
            <p className="text-center text-[11px] text-gray-300 pb-2">
              Atelier Rose v1.0
            </p>
          </div>
        </main>
      </div>

      <BottomNav onAdd={() => navigate(ROUTES.SCHEDULE)} />
    </div>
  )
}
