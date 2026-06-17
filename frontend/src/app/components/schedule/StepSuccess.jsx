import { RiCheckLine, RiNotificationLine } from 'react-icons/ri'
import { formatLongDate } from '../../utils/date'

export default function StepSuccess({ booking, onHome }) {
  const { professional, date, time } = booking
  const proName   = professional?.id ? professional.name : 'uma profissional'
  const dateLabel = date ? formatLongDate(date) : ''

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-6">
      {/* check icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-pink-200"
        style={{ background: 'linear-gradient(135deg, #f472b6 0%, #e0399c 100%)' }}
      >
        <RiCheckLine size={36} className="text-white" strokeWidth={1} />
      </div>

      {/* message */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
          Tudo certo!
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
          Seu horário com{' '}
          <span className="font-bold text-gray-800">{proName}</span>
          {' '}foi confirmado para{' '}
          <span className="font-bold text-gray-800">{dateLabel} às {time}</span>.
        </p>
      </div>

      {/* reminder notice */}
      <div className="flex items-start gap-3 bg-gray-50 rounded-2xl px-4 py-4 w-full max-w-sm text-left">
        <RiNotificationLine size={18} className="text-gray-400 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Avisaremos 1h antes do horário. Você pode reagendar até 4h antes.
        </p>
      </div>

      {/* actions */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          className="w-full py-4 rounded-full text-white text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #f472b6 0%, #e0399c 50%, #c41d68 100%)' }}
          onClick={() => {
            if (booking.date && booking.time) {
              const [h, m] = booking.time.split(':').map(Number)
              const start = new Date(booking.date)
              start.setHours(h, m, 0, 0)
              const end = new Date(start.getTime() + (booking.service?.duration_minutes ?? 60) * 60000)
              const fmt = (d) => d.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
              const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(booking.service?.name ?? 'Agendamento')}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(`Com ${proName} no Atelier Rose`)}`
              window.open(url, '_blank', 'noopener,noreferrer')
            }
          }}
        >
          Adicionar ao calendário
        </button>
        <button
          onClick={onHome}
          className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors py-1"
        >
          Voltar para o início
        </button>
      </div>
    </div>
  )
}
