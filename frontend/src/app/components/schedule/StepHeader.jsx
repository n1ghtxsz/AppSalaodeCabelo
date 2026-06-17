import { RiArrowLeftLine } from 'react-icons/ri'

const TOTAL = 4

export default function StepHeader({ step, title, onBack }) {
  return (
    <div className="px-4 pt-4 md:pt-6 pb-1">
      <div className="flex items-center gap-3 mb-1">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
          aria-label="Voltar"
        >
          <RiArrowLeftLine size={20} />
        </button>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            Etapa {step} de {TOTAL}
          </p>
          <h1 className="text-base font-bold text-gray-900 leading-tight mt-0.5">{title}</h1>
        </div>
      </div>

      {/* progress bar */}
      <div className="flex gap-1 mt-3">
        {Array.from({ length: TOTAL }, (_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
              i < step ? 'bg-pink-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
