import { RiCalendarEventLine, RiTimeLine, RiLoader4Line } from 'react-icons/ri'

function fmt(isoString, type) {
  if (!isoString) return ''
  const d = new Date(isoString)
  if (type === 'date') {
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })
      .format(d).replace('.', '')
  }
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(d)
}

function Skeleton() {
  return (
    <div className="mx-4 rounded-2xl p-5 min-h-[180px] bg-gray-100 animate-pulse" />
  )
}

function EmptyState({ onBook }) {
  return (
    <div
      className="mx-4 rounded-2xl p-6 flex flex-col items-center text-center"
      style={{ background: 'linear-gradient(135deg, #c41d68 0%, #e0399c 55%, #f472b6 100%)' }}
    >
      <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2">Próximo Horário</p>
      <p className="text-white text-lg font-bold mb-1">Nenhum agendamento</p>
      <p className="text-white/70 text-sm mb-4">Você não tem horários marcados.</p>
      <button
        onClick={onBook}
        className="bg-white text-gray-900 text-xs font-bold px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
      >
        Agendar agora
      </button>
    </div>
  )
}

export default function NextAppointmentCard({ appointment, loading, onCancel, onReschedule, onDetails, onBook }) {
  if (loading) return <Skeleton />
  if (!appointment) return <EmptyState onBook={onBook} />

  const service     = appointment.services
  const professional = appointment.professionals

  return (
    <div
      className="mx-4 relative overflow-hidden rounded-2xl p-5"
      style={{ background: 'linear-gradient(135deg, #c41d68 0%, #e0399c 55%, #f472b6 100%)' }}
    >
      {/* orb decoration */}
      <div
        className="absolute -top-10 -right-10 w-44 h-44 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2">
          Próximo Horário
        </p>

        <h2
          className="text-white text-2xl font-bold italic leading-tight mb-1"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {service?.name ?? '—'}
        </h2>

        {professional?.name && (
          <p className="text-white/75 text-sm mb-3">com {professional.name}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-2.5 py-1.5 rounded-full">
            <RiCalendarEventLine size={11} />
            {fmt(appointment.scheduled_at, 'date')}
          </span>
          <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-2.5 py-1.5 rounded-full">
            <RiTimeLine size={11} />
            {fmt(appointment.scheduled_at, 'time')}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onDetails}
            className="flex-1 bg-white text-gray-900 text-xs font-bold py-2.5 rounded-full hover:bg-gray-50 transition-colors"
          >
            Ver detalhes
          </button>
          <button
            onClick={onReschedule}
            className="px-4 border border-white/40 text-white text-xs font-semibold py-2.5 rounded-full hover:bg-white/10 transition-colors"
          >
            Remarcar
          </button>
        </div>
      </div>
    </div>
  )
}
