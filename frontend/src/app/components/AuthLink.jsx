export default function AuthLink({ text = 'Já tem conta?', linkLabel = 'Entrar', onClick }) {
  return (
    <p className="text-center text-white/70 text-sm">
      {text}{' '}
      <button
        onClick={onClick}
        className="
          text-white font-semibold underline underline-offset-2
          hover:text-white/90 transition-colors duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded
        "
      >
        {linkLabel}
      </button>
    </p>
  )
}
