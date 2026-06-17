import { RiSparklingLine, RiCheckLine, RiTimeLine, RiStarFill, RiScissorsCutLine } from 'react-icons/ri'
import { formatDuration } from '../../utils/date'

const PRO_GRADIENTS = [
  'linear-gradient(160deg, #fda4af 0%, #f43f5e 100%)',
  'linear-gradient(160deg, #c4b5fd 0%, #7c3aed 100%)',
  'linear-gradient(160deg, #f9a8d4 0%, #ec4899 100%)',
  'linear-gradient(160deg, #6ee7b7 0%, #059669 100%)',
]

function ServiceChip({ service, onEdit }) {
  return (
    <div className="mx-4 flex items-center gap-2.5 bg-pink-50 rounded-xl px-4 py-2.5">
      <span className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center shrink-0">
        <RiScissorsCutLine size={14} style={{ color: '#e0399c' }} />
      </span>
      <span className="text-sm font-semibold text-gray-800 flex-1 min-w-0 truncate">
        {service.name} · {formatDuration(service.duration_minutes)}
      </span>
      <button
        onClick={onEdit}
        className="text-xs font-bold shrink-0"
        style={{ color: '#e0399c' }}
      >
        Editar
      </button>
    </div>
  )
}

function ProfessionalItem({ professional, index, selected, onSelect }) {
  const gradient = PRO_GRADIENTS[index % PRO_GRADIENTS.length]

  return (
    <button
      onClick={() => onSelect(professional)}
      className={`flex items-center gap-4 w-full p-4 rounded-2xl border-2 text-left transition-all ${
        selected ? 'border-pink-500 bg-pink-50/40' : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      {professional.id ? (
        <div
          className="w-12 h-12 rounded-full shrink-0 overflow-hidden"
          style={{ background: professional.avatar_url ? undefined : gradient }}
        >
          {professional.avatar_url && (
            <img src={professional.avatar_url} alt={professional.name} className="w-full h-full object-cover" />
          )}
        </div>
      ) : (
        <span className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
          <RiSparklingLine size={20} style={{ color: '#e0399c' }} />
        </span>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">{professional.name}</p>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          {professional.role}
          {professional.years_experience ? ` · ${professional.years_experience} anos` : ''}
        </p>
        {(professional.rating || professional.appointments_count) && (
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            {professional.rating && (
              <>
                <RiStarFill size={10} className="text-amber-400" />
                {professional.rating}
              </>
            )}
            {professional.appointments_count && (
              <span className="text-gray-400">· {professional.appointments_count} atendimentos</span>
            )}
          </p>
        )}
      </div>

      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
        selected ? 'bg-pink-500 border-pink-500 text-white' : 'border-gray-300'
      }`}>
        {selected && <RiCheckLine size={11} />}
      </span>
    </button>
  )
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-gray-100 shrink-0" />
          <div className="flex-1">
            <div className="h-3.5 bg-gray-100 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

const NO_PREFERENCE = { id: null, name: 'Sem preferência', role: 'Indicamos a melhor opção pra você' }

export default function StepProfessional({ service, professionals, loading, selected, onSelect, onEditService }) {
  const all = [NO_PREFERENCE, ...professionals]

  return (
    <div className="flex flex-col gap-4">
      <ServiceChip service={service} onEdit={onEditService} />

      <div className="flex flex-col gap-2.5 px-4">
        {loading ? <Skeleton /> : all.map((pro, i) => (
          <ProfessionalItem
            key={pro.id ?? 'none'}
            professional={pro}
            index={i - 1}
            selected={selected?.id === pro.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
