import { RiCalendarEventLine, RiTimeLine, RiLoader4Line } from 'react-icons/ri'
import { formatShortDate, formatDuration } from '../../utils/date'
import { SALON } from '../../../constants'

export default function StepConfirm({ booking, submitting, onConfirm }) {
  const { service, professional, date, time } = booking

  const proName = professional?.id ? professional.name : 'Profissional a definir'
  const dateLabel = date ? formatShortDate(date) : '—'

  return (
    <div className="flex flex-col gap-4 px-4">
      {/* summary card */}
      <div
        className="relative overflow-hidden rounded-2xl p-5"
        style={{ background: 'linear-gradient(135deg, #c41d68 0%, #e0399c 60%, #f472b6 100%)' }}
      >
        <div
          className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2">Resumo</p>
          <h2
            className="text-white text-2xl font-bold italic leading-tight mb-1"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {service?.name}
          </h2>
          <p className="text-white/70 text-sm mb-4">com {proName}</p>
          <div className="flex gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-2.5 py-1.5 rounded-full">
              <RiCalendarEventLine size={11} /> {dateLabel}
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-2.5 py-1.5 rounded-full">
              <RiTimeLine size={11} /> {time}
            </span>
          </div>
        </div>
      </div>

      {/* details */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {[
          { label: 'Duração',   value: formatDuration(service?.duration_minutes ?? 0) },
          { label: 'Local',     value: `${SALON.name} · ${SALON.address}` },
          { label: 'Pagamento', value: 'No salão' },
          { label: 'Política',  value: 'Cancele até 4h antes sem custo' },
        ].map(({ label, value }, i, arr) => (
          <div key={label} className={`flex items-start justify-between px-5 py-4 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
            <span className="text-sm text-gray-400">{label}</span>
            <span className="text-sm font-medium text-gray-800 text-right max-w-[55%]">{value}</span>
          </div>
        ))}
      </div>

      {/* total */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-gray-500">Total estimado</span>
        <span className="text-xl font-bold text-gray-900">
          R$ {Number(service?.price ?? 0).toFixed(2).replace('.', ',')}
        </span>
      </div>

      {/* confirm button */}
      <button
        onClick={onConfirm}
        disabled={submitting}
        aria-busy={submitting}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 mt-2"
        style={{ background: 'linear-gradient(135deg, #f472b6 0%, #e0399c 50%, #c41d68 100%)' }}
      >
        {submitting ? (
          <RiLoader4Line size={18} className="animate-spin" />
        ) : (
          '✓  Confirmar agendamento'
        )}
      </button>
    </div>
  )
}
