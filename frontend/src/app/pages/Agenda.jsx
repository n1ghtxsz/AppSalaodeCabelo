import { useState, useMemo }    from 'react'
import { useNavigate }           from 'react-router-dom'
import { RiArrowRightSLine }     from 'react-icons/ri'
import { useAppointments }       from '../hooks/useAppointments'
import { useAuth }               from '../hooks/useAuth'
import AppSidebar                from '../components/AppSidebar'
import BottomNav                 from '../components/BottomNav'
import { ROUTES }                from '../../constants'
import {
  getDaysFrom, toDateStr, formatWeekdayShort,
  formatLongDate, formatMonthYear, isSameDay, isToday,
} from '../utils/date'

/* ── helpers ─────────────────────────────────────────────── */

const TODAY = new Date()
TODAY.setHours(0, 0, 0, 0)

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function fmtDuration(min) {
  if (!min) return ''
  const h = Math.floor(min / 60)
  const m = min % 60
  return h ? (m ? `${h}h ${m}min` : `${h}h`) : `${min} min`
}

const STATUS_CFG = {
  pending:   { label: 'Pendente',   cls: 'bg-amber-50 text-amber-600'   },
  confirmed: { label: 'Confirmado', cls: 'bg-emerald-50 text-emerald-600' },
  completed: { label: 'Finalizado', cls: 'bg-pink-50 text-pink-600'     },
  cancelled: { label: 'Cancelado',  cls: 'bg-red-50 text-red-500'       },
  no_show:   { label: 'Não veio',   cls: 'bg-gray-50 text-gray-500'     },
}

/* ── date strip ──────────────────────────────────────────── */

function DateStrip({ days, selected, onChange }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 px-4 md:px-6 scrollbar-hide">
      {days.map((day) => {
        const sel  = isSameDay(day, selected)
        const past = day < TODAY
        return (
          <button
            key={day.toISOString()}
            onClick={() => !past && onChange(day)}
            disabled={past}
            className={`flex flex-col items-center shrink-0 w-12 py-2 rounded-2xl transition-colors duration-150 ${
              sel   ? 'text-white'
              : past ? 'text-gray-300 cursor-not-allowed'
              :         'text-gray-500 hover:bg-gray-100'
            }`}
            style={sel ? { background: 'linear-gradient(135deg, #f472b6 0%, #e0399c 100%)' } : {}}
          >
            <span className="text-[10px] font-semibold uppercase leading-none">
              {formatWeekdayShort(day)}
            </span>
            <span className="text-lg font-bold leading-tight">{day.getDate()}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ── stats ───────────────────────────────────────────────── */

function StatsRow({ agendados, confirmados, previsto }) {
  return (
    <div className="grid grid-cols-3 gap-2 px-4 md:px-6">
      {[
        { value: agendados,  label: 'Agendados'  },
        { value: confirmados, label: 'Confirmados' },
        { value: `R$ ${Number(previsto).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, label: 'Previsto' },
      ].map(({ value, label }) => (
        <div key={label} className="bg-white rounded-2xl border border-gray-100 px-4 py-3 text-center shadow-sm">
          <p className="text-lg font-bold text-gray-900 leading-none">{value}</p>
          <p className="text-[11px] text-gray-400 mt-1">{label}</p>
        </div>
      ))}
    </div>
  )
}

/* ── appointment item ────────────────────────────────────── */

function AppointmentItem({ apt, onPress }) {
  const service      = apt.services
  const professional = apt.professionals
  const aptDate      = new Date(apt.scheduled_at)
  const isNow        = isToday(aptDate) && ['pending', 'confirmed'].includes(apt.status)
  const cfg          = STATUS_CFG[apt.status] ?? STATUS_CFG.pending

  return (
    <button
      onClick={onPress}
      className={`flex items-stretch gap-4 w-full bg-white rounded-2xl border text-left transition-all hover:shadow-sm active:scale-[0.99] ${
        isNow ? 'border-pink-200' : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      {/* pink accent bar (today) */}
      {isNow && (
        <div className="w-1 rounded-l-2xl shrink-0" style={{ background: 'linear-gradient(180deg, #f472b6 0%, #e0399c 100%)' }} />
      )}

      {/* time column */}
      <div className={`flex flex-col justify-center py-4 ${isNow ? 'pl-2' : 'pl-4'} w-16 shrink-0`}>
        <span className="text-base font-bold text-gray-900 leading-none">{fmtTime(apt.scheduled_at)}</span>
        <span className="text-[11px] text-gray-400 mt-1">{fmtDuration(service?.duration_minutes)}</span>
      </div>

      {/* content */}
      <div className="flex-1 min-w-0 py-4">
        <p className="text-sm font-bold text-gray-900 truncate">{service?.name ?? '—'}</p>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          com {professional?.name ?? 'Profissional'}
        </p>
        <span className={`inline-block mt-2 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
          isNow ? 'bg-pink-100 text-pink-600' : cfg.cls
        }`}>
          {isNow ? 'Hoje' : cfg.label}
        </span>
      </div>

      <div className="flex items-center pr-4 shrink-0">
        <RiArrowRightSLine size={18} className="text-gray-300" />
      </div>
    </button>
  )
}

/* ── skeleton ────────────────────────────────────────────── */

function SkeletonItem() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 animate-pulse">
      <div className="w-16 shrink-0">
        <div className="h-4 bg-gray-100 rounded w-10 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-8" />
      </div>
      <div className="flex-1">
        <div className="h-3.5 bg-gray-100 rounded w-2/5 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
        <div className="h-5 bg-gray-100 rounded-full w-20" />
      </div>
    </div>
  )
}

/* ── empty ───────────────────────────────────────────────── */

function Empty({ onSchedule }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center px-6">
      <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-4">
        <span className="text-2xl">📅</span>
      </div>
      <p className="text-sm font-bold text-gray-700 mb-1">Nenhum agendamento nessa data</p>
      <p className="text-xs text-gray-400 mb-5">Que tal marcar um horário?</p>
      <button
        onClick={onSchedule}
        className="px-6 py-2.5 rounded-full text-white text-sm font-bold"
        style={{ background: 'linear-gradient(135deg, #f472b6 0%, #e0399c 100%)' }}
      >
        Agendar agora
      </button>
    </div>
  )
}

/* ── page ────────────────────────────────────────────────── */

export default function Agenda() {
  const navigate           = useNavigate()
  const { user }           = useAuth()
  const { appointments, loading } = useAppointments()
  const [selected, setSelected]   = useState(TODAY)

  const days = getDaysFrom(TODAY, 30)

  /* appointments for selected day */
  const dayApts = useMemo(() =>
    appointments
      .filter((a) => isSameDay(new Date(a.scheduled_at), selected))
      .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at)),
    [appointments, selected]
  )

  /* stats (upcoming only) */
  const { agendados, confirmados, previsto } = useMemo(() => {
    const upcoming = appointments.filter(
      (a) => new Date(a.scheduled_at) >= TODAY && ['pending', 'confirmed'].includes(a.status)
    )
    return {
      agendados:   upcoming.length,
      confirmados: upcoming.filter((a) => a.status === 'confirmed').length,
      previsto:    upcoming.reduce((s, a) => s + Number(a.price || 0), 0),
    }
  }, [appointments])

  const initials  = user?.name?.split(' ').filter(Boolean).map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'U'
  const dayLabel  = formatWeekdayShort(selected).toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) + '-feira'
  const dateLabel = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' }).format(selected)

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">

        {/* header */}
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 pt-5 pb-4 sticky top-0 z-30">
          {/* mobile: date + avatar */}
          <div className="flex items-start justify-between mb-4 md:mb-0">
            <div>
              <p className="text-xs text-gray-400 capitalize">{dayLabel}</p>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight capitalize"
                style={{ fontFamily: 'var(--font-serif)' }}>
                {dateLabel}
              </h1>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)' }}
            >
              {initials}
            </div>
          </div>

          {/* desktop: title row */}
          <div className="hidden md:block mb-4">
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-serif)' }}>
              Minha Agenda
            </h1>
          </div>

          <DateStrip days={days} selected={selected} onChange={setSelected} />
        </header>

        <main
          className="flex-1 overflow-y-auto"
          style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-2xl mx-auto flex flex-col gap-4 py-4">

            {/* stats */}
            <StatsRow agendados={agendados} confirmados={confirmados} previsto={previsto} />

            {/* section label */}
            <p className="px-4 md:px-6 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Próximos atendimentos
            </p>

            {/* list */}
            <div className="flex flex-col gap-2.5 px-4 md:px-6">
              {loading
                ? Array.from({ length: 4 }, (_, i) => <SkeletonItem key={i} />)
                : dayApts.length === 0
                ? <Empty onSchedule={() => navigate(ROUTES.SCHEDULE)} />
                : dayApts.map((apt) => (
                    <AppointmentItem key={apt.id} apt={apt} onPress={() => {}} />
                  ))
              }
            </div>
          </div>
        </main>
      </div>

      <BottomNav onAdd={() => navigate(ROUTES.SCHEDULE)} />
    </div>
  )
}
