import { useNavigate, useLocation } from 'react-router-dom'
import {
  RiSparklingFill,
  RiHome5Fill, RiHome5Line,
  RiCalendar2Line,
  RiHistoryFill, RiHistoryLine,
  RiHeartFill, RiHeartLine,
  RiUserLine, RiLogoutBoxRLine,
} from 'react-icons/ri'
import { useAuth }  from '../hooks/useAuth'
import { ROUTES }   from '../../constants'

const NAV = [
  { id: 'inicio',    label: 'Início',    route: ROUTES.DASHBOARD, IconOn: RiHome5Fill,    IconOff: RiHome5Line    },
  { id: 'agenda',    label: 'Agenda',    route: ROUTES.AGENDA,    IconOn: RiCalendar2Line, IconOff: RiCalendar2Line },
  { id: 'historico', label: 'Histórico', route: ROUTES.HISTORY,   IconOn: RiHistoryFill,  IconOff: RiHistoryLine  },
  { id: 'favoritos', label: 'Favoritos', route: null,             IconOn: RiHeartFill,    IconOff: RiHeartLine    },
  { id: 'perfil',    label: 'Perfil',    route: ROUTES.PROFILE,   IconOn: RiUserLine,     IconOff: RiUserLine     },
]

function activeId(pathname) {
  if (pathname.startsWith(ROUTES.HISTORY))   return 'historico'
  if (pathname.startsWith(ROUTES.PROFILE))   return 'perfil'
  if (pathname.startsWith(ROUTES.AGENDA))    return 'agenda'
  if (pathname.startsWith(ROUTES.DASHBOARD)) return 'inicio'
  return 'inicio'
}

export default function AppSidebar() {
  const navigate        = useNavigate()
  const { pathname }    = useLocation()
  const { logout }      = useAuth()
  const current         = activeId(pathname)

  function handleClick(item) {
    if (item.route) navigate(item.route)
  }

  function handleLogout() {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <aside className="hidden md:flex flex-col w-52 min-h-screen bg-white border-r border-gray-100 shrink-0 sticky top-0 h-screen">
      {/* logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #e0399c 0%, #c41d68 100%)' }}
        >
          <RiSparklingFill className="text-white text-base" />
        </span>
        <div className="leading-none">
          <p className="text-sm font-bold text-gray-900">Atelier Rose</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Cliente</p>
        </div>
      </div>

      {/* nav */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ id, label, route, IconOn, IconOff }) => {
          const on   = current === id
          const Icon = on ? IconOn : IconOff
          return (
            <button
              key={id}
              onClick={() => handleClick({ route })}
              disabled={!route}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left ${
                on
                  ? 'bg-pink-50 text-gray-900'
                  : route
                  ? 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <Icon size={18} style={{ color: on ? '#e0399c' : undefined }} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* promo */}
      <div
        className="mx-3 mb-4 rounded-2xl p-4"
        style={{ background: 'linear-gradient(135deg, #f472b6 0%, #e0399c 100%)' }}
      >
        <RiSparklingFill className="text-white/80 mb-2" size={18} />
        <p className="text-white text-sm font-bold leading-tight">Atelier Rose Pro</p>
        <p className="text-white/75 text-[11px] mt-1 leading-relaxed">
          Lembretes automáticos por WhatsApp.
        </p>
        <button className="mt-3 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors">
          Saber mais
        </button>
      </div>

      {/* logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 px-5 py-4 text-xs text-gray-400 hover:text-red-500 transition-colors border-t border-gray-100"
      >
        <RiLogoutBoxRLine size={15} />
        Sair
      </button>
    </aside>
  )
}
