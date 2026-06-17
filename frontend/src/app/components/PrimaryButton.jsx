import { RiSparklingFill } from 'react-icons/ri'

export default function PrimaryButton({ label = 'Agendar agora', onClick, loading = false, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className="
        w-full flex items-center justify-center gap-2
        bg-white rounded-full
        px-6 py-4
        text-sm font-semibold tracking-wide
        transition-all duration-200 ease-out
        hover:bg-white/90 hover:scale-[1.01]
        active:scale-[0.98] active:bg-white/80
        focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40
        disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
        select-none
      "
      style={{ color: '#8b0847' }}
    >
      {loading ? (
        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
      ) : (
        <RiSparklingFill className="text-base shrink-0" aria-hidden="true" />
      )}
      <span>{loading ? 'Aguarde...' : label}</span>
    </button>
  )
}
