import { SALON, LANG } from '../../constants'

export default function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 pt-12 pb-4">
      <span
        className="text-white text-sm font-semibold tracking-[0.2em] uppercase select-none"
        style={{ fontFamily: 'var(--font-sans)' }}
        aria-label={`Salão ${SALON.name}`}
      >
        {SALON.name}
      </span>

      <button
        className="text-white text-xs font-medium tracking-widest opacity-75 hover:opacity-100 transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded px-1"
        aria-label="Selecionar idioma"
      >
        {LANG}
      </button>
    </header>
  )
}
