import { useState } from 'react'
import { RiTimeLine, RiCheckLine } from 'react-icons/ri'
import { formatDuration } from '../../utils/date'

const CATEGORY_COLORS = {
  'Cabelo':    'linear-gradient(135deg, #fda4af 0%, #fb7185 100%)',
  'Unhas':     'linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%)',
  'Maquiagem': 'linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)',
  'Estética':  'linear-gradient(135deg, #6ee7b7 0%, #10b981 100%)',
}
const DEFAULT_COLOR = 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)'

function ServiceItem({ service, selected, onSelect }) {
  const gradient = CATEGORY_COLORS[service.category] ?? DEFAULT_COLOR
  return (
    <button
      onClick={() => onSelect(service)}
      className={`flex items-center gap-4 w-full p-4 rounded-2xl border-2 text-left transition-all duration-150 ${
        selected
          ? 'border-pink-500 bg-pink-50/50'
          : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      <div className="w-12 h-12 rounded-2xl shrink-0" style={{ background: gradient }} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">{service.name}</p>
        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
          <RiTimeLine size={11} />
          {formatDuration(service.duration_minutes)}
          <span className="text-gray-300">·</span>
          <span className="font-semibold text-gray-600">
            R$ {Number(service.price).toFixed(0)}
          </span>
        </p>
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
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 shrink-0" />
          <div className="flex-1">
            <div className="h-3.5 bg-gray-100 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function StepService({ services, categories, loading, selected, onSelect }) {
  const [activeCategory, setActiveCategory] = useState('Todos')

  const filtered = activeCategory === 'Todos'
    ? services
    : services.filter((s) => s.category === activeCategory)

  const pills = ['Todos', ...categories.map((c) => c.name)]

  return (
    <div className="flex flex-col gap-4">
      {/* category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 px-4 scrollbar-hide">
        {pills.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              activeCategory === cat
                ? 'text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            style={activeCategory === cat ? { background: 'linear-gradient(135deg, #f472b6 0%, #e0399c 100%)' } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* list */}
      <div className="flex flex-col gap-2.5 px-4">
        {loading ? <Skeleton /> : filtered.map((s) => (
          <ServiceItem key={s.id} service={s} selected={selected?.id === s.id} onSelect={onSelect} />
        ))}
        {!loading && filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">Nenhum serviço encontrado.</p>
        )}
      </div>
    </div>
  )
}
