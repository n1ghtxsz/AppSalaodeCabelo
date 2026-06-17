import { RiSparklingFill } from 'react-icons/ri'
import { SALON } from '../../constants'

export default function StatusBadge() {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
      style={{
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.15)',
      }}
      role="status"
      aria-label={`${SALON.status} em ${SALON.address}`}
    >
      <RiSparklingFill className="text-white/90 text-xs shrink-0" aria-hidden="true" />
      <span className="text-white text-xs font-medium tracking-wide whitespace-nowrap">
        {SALON.status} · {SALON.address}
      </span>
    </div>
  )
}
