const GRADIENTS = [
  'linear-gradient(160deg, #f9a8d4 0%, #ec4899 100%)',
  'linear-gradient(160deg, #c4b5fd 0%, #8b5cf6 100%)',
  'linear-gradient(160deg, #fca5a5 0%, #ef4444 100%)',
  'linear-gradient(160deg, #6ee7b7 0%, #10b981 100%)',
  'linear-gradient(160deg, #93c5fd 0%, #3b82f6 100%)',
  'linear-gradient(160deg, #fde68a 0%, #f59e0b 100%)',
]

function SkeletonCard() {
  return (
    <div className="shrink-0 w-28">
      <div className="w-28 h-36 rounded-2xl bg-gray-100 animate-pulse mb-2" />
      <div className="h-3 w-16 bg-gray-100 rounded animate-pulse mb-1.5" />
      <div className="h-2.5 w-12 bg-gray-100 rounded animate-pulse" />
    </div>
  )
}

function ProfessionalCard({ professional, gradient }) {
  return (
    <div className="shrink-0 w-28">
      <div
        className="w-28 h-36 rounded-2xl mb-2 overflow-hidden"
        style={{ background: professional.avatar_url ? undefined : gradient }}
      >
        {professional.avatar_url && (
          <img
            src={professional.avatar_url}
            alt={professional.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <p className="text-sm font-bold text-gray-900 truncate">{professional.name.split(' ')[0]}</p>
      <p className="text-xs text-gray-400 truncate">{professional.role}</p>
    </div>
  )
}

export default function ProfessionalsList({ professionals, loading, onViewAll }) {
  return (
    <section className="px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: 'var(--font-serif)' }}>
          Profissionais
        </h2>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold"
          style={{ color: '#e0399c' }}
        >
          Ver todas
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : professionals.length === 0
          ? <p className="text-sm text-gray-400 py-4">Nenhuma profissional cadastrada.</p>
          : professionals.map((p, i) => (
              <ProfessionalCard
                key={p.id}
                professional={p}
                gradient={GRADIENTS[i % GRADIENTS.length]}
              />
            ))
        }
      </div>
    </section>
  )
}
