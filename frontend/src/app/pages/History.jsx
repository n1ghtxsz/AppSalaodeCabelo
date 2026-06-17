import { useState, useMemo }  from 'react'
import { useNavigate }         from 'react-router-dom'
import { RiEqualizerLine, RiInboxLine } from 'react-icons/ri'
import { useAppointments }     from '../hooks/useAppointments'
import AppSidebar              from '../components/AppSidebar'
import BottomNav               from '../components/BottomNav'
import { ROUTES }              from '../../constants'
import { isToday, formatTime } from '../utils/date'

/* ── helpers ─────────────────────────────────────────────── */

const GRADIENTS = [
  'linear-gradient(135deg, #fda4af 0%, #fb7185 100%)',
  'linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%)',
  'linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)',
  'linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)',
  'linear-gradient(135deg, #6ee7b7 0%, #10b981 100%)',
]

function gradientFor(str) {
  let h = 0
  for (const c of String(str || '')) h = (h * 31 + c.charCodeAt(0)) | 0
  return GRADIENTS[Math.abs(h) % GRADIENTS.length]
}

function formatCardDate(iso) {
  const d = new Date(iso)
  if (isToday(d)) return `Hoje, ${formatTime(d)}`
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
    .format(d).replace(/\./g, '')
}

const STATUS = {
  pending:   { label: 'Pendente',   bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200'   },
  confirmed: { label: 'Confirmado', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  completed: { label: 'Finalizado', bg: 'bg-pink-50',    text: 'text-pink-600',    border: 'border-pink-200'    },
  cancelled: { label: 'Cancelado',  bg: 'bg-red-50',     text: 'text-red-500',     border: 'border-red-200'     },
  no_show:   { label: 'Não veio',   bg: 'bg-gray-50',    text: 'text-gray-500',    border: 'border-gray-200'    },
}

const FILTERS = [
  { id: 'todos',     label: 'Todos',       statuses: null },
  { id: 'confirmed', label: 'Confirmados', statuses: ['confirmed', 'pending'] },
  { id: 'completed', label: 'Finalizados', statuses: ['completed'] },
  { id: 'cancelled', label: 'Cancelados',  statuses: ['cancelled', 'no_show'] },
]

/* ── sub-components ──────────────────────────────────────── */

function FilterPills({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 px-4 md:px-6 scrollbar-hide">
      {FILTERS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            active === id ? 'text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          style={active === id ? { background: 'linear-gradient(135deg, #f472b6 0%, #e0399c 100%)' } : {}}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function StatusBadge({ status }) {
  const cfg = STATUS[status] ?? STATUS.pending
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {cfg.label}
    </span>
  )
}

function AppointmentCard({ appointment }) {
  const service      = appointment.services
  const professional = appointment.professionals

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-150">
      <div
        className="w-14 h-14 rounded-2xl shrink-0"
        style={{ background: gradientFor(service?.id) }}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">{service?.name ?? '—'}</p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">com {professional?.name ?? 'Profissional'}</p>
        <p className="text-xs text-gray-400 mt-0.5">{formatCardDate(appointment.scheduled_at)}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <StatusBadge status={appointment.status} />
        <span className="text-xs font-semibold text-gray-400 hidden sm:block">
          R$ {Number(appointment.price ?? 0).toFixed(0)}
        </span>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 animate-pulse">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 shrink-0" />
      <div className="flex-1">
        <div className="h-3.5 bg-gray-100 rounded w-1/3 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/2 mb-1.5" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
      </div>
      <div className="h-6 w-20 bg-gray-100 rounded-full" />
    </div>
  )
}

function EmptyState({ filtered }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
        <RiInboxLine size={28} className="text-gray-300" />
      </div>
      <p className="text-sm font-bold text-gray-500">
        {filtered ? 'Nenhum agendamento nessa categoria' : 'Nenhum agendamento ainda'}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {filtered ? 'Tente outro filtro.' : 'Seus agendamentos aparecerão aqui.'}
      </p>
    </div>
  )
}

/* ── page ────────────────────────────────────────────────── */

export default function History() {
  const navigate     = useNavigate()
  const { appointments, loading } = useAppointments()
  const [activeFilter, setActiveFilter] = useState('todos')

  const filtered = useMemo(() => {
    const rule = FILTERS.find((f) => f.id === activeFilter)
    if (!rule?.statuses) return appointments
    return appointments.filter((a) => rule.statuses.includes(a.status))
  }, [appointments, activeFilter])

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-serif)' }}>
              Histórico
            </h1>
            <button
              className="p-2 rounded-full hover:bg-gray-50 text-gray-500 transition-colors"
              aria-label="Filtros avançados"
            >
              <RiEqualizerLine size={20} />
            </button>
          </div>
          <div className="pb-3">
            <FilterPills active={activeFilter} onChange={setActiveFilter} />
          </div>
        </header>

        <main
          className="flex-1 overflow-y-auto px-4 md:px-6 py-4"
          style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-2xl mx-auto flex flex-col gap-2.5">
            {loading
              ? Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)
              : filtered.length === 0
              ? <EmptyState filtered={activeFilter !== 'todos'} />
              : filtered.map((apt) => <AppointmentCard key={apt.id} appointment={apt} />)
            }
          </div>
        </main>
      </div>

      <BottomNav onAdd={() => navigate(ROUTES.SCHEDULE)} />
    </div>
  )
}
