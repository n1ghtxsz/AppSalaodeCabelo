import { RiSparklingLine, RiScissorsCutLine, RiHeartLine, RiMapPinLine } from 'react-icons/ri'

const ACTIONS = [
  { id: 'agendar',   label: 'Agendar',  Icon: RiSparklingLine,   bg: '#fce7f3', color: '#e0399c' },
  { id: 'servicos',  label: 'Serviços', Icon: RiScissorsCutLine, bg: '#fce7f3', color: '#e0399c' },
  { id: 'favoritos', label: 'Favoritos',Icon: RiHeartLine,       bg: '#fce7f3', color: '#e0399c' },
  { id: 'salao',     label: 'Salão',    Icon: RiMapPinLine,      bg: '#fce7f3', color: '#e0399c' },
]

export default function QuickActions({ onAction, className = 'px-4' }) {
  return (
    <div className={`grid grid-cols-4 gap-3 ${className}`}>
      {ACTIONS.map(({ id, label, Icon, bg, color }) => (
        <button
          key={id}
          onClick={() => onAction?.(id)}
          className="flex flex-col items-center gap-2 transition-opacity active:opacity-70"
        >
          <span
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: bg }}
          >
            <Icon size={22} style={{ color }} />
          </span>
          <span className="text-xs text-gray-500 font-medium">{label}</span>
        </button>
      ))}
    </div>
  )
}
