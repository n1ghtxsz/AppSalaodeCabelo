import { useNavigate, useLocation } from 'react-router-dom'
import {
  RiHome5Fill, RiHome5Line,
  RiCalendar2Line,
  RiHistoryFill, RiHistoryLine,
  RiUserLine, RiAddLine,
} from 'react-icons/ri'
import { ROUTES } from '../../constants'

const ITEMS = [
  { id: 'inicio',    label: 'Início',    route: ROUTES.DASHBOARD, IconOn: RiHome5Fill,    IconOff: RiHome5Line    },
  { id: 'agenda',    label: 'Agenda',    route: ROUTES.AGENDA,    IconOn: RiCalendar2Line, IconOff: RiCalendar2Line },
  { id: '__add__',   label: '',          route: null,             IconOn: null,            IconOff: null           },
  { id: 'historico', label: 'Histórico', route: ROUTES.HISTORY,   IconOn: RiHistoryFill,  IconOff: RiHistoryLine  },
  { id: 'perfil',    label: 'Perfil',    route: ROUTES.PROFILE,   IconOn: RiUserLine,     IconOff: RiUserLine     },
]

function activeId(pathname) {
  if (pathname.startsWith(ROUTES.HISTORY))   return 'historico'
  if (pathname.startsWith(ROUTES.PROFILE))   return 'perfil'
  if (pathname.startsWith(ROUTES.AGENDA))    return 'agenda'
  if (pathname.startsWith(ROUTES.DASHBOARD)) return 'inicio'
  return ''
}

export default function BottomNav({ onAdd }) {
  const navigate     = useNavigate()
  const { pathname } = useLocation()
  const current      = activeId(pathname)

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-end h-16">
        {ITEMS.map(({ id, label, route, IconOn, IconOff }) => {
          if (id === '__add__') {
            return (
              <div key={id} className="flex-1 flex justify-center items-end pb-3">
                <button
                  onClick={onAdd}
                  className="w-14 h-14 -mt-5 rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-200 transition-transform active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #f472b6 0%, #e0399c 100%)' }}
                  aria-label="Agendar"
                >
                  <RiAddLine size={24} />
                </button>
              </div>
            )
          }

          const on   = current === id
          const Icon = on ? IconOn : IconOff
          return (
            <button
              key={id}
              onClick={() => route && navigate(route)}
              disabled={!route}
              className={`flex-1 flex flex-col items-center justify-end pb-2 gap-0.5 transition-colors ${!route ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <Icon size={22} style={{ color: on ? '#e0399c' : '#9ca3af' }} />
              <span className={`text-[10px] font-semibold ${on ? 'text-pink-500' : 'text-gray-400'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
