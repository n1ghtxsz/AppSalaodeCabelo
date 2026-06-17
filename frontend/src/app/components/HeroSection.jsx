import { SALON } from '../../constants'

export default function HeroSection() {
  return (
    <section aria-labelledby="hero-heading">
      <h1
        id="hero-heading"
        className="text-white text-[2.75rem] leading-[1.1] font-bold italic mb-4"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {SALON.tagline}
      </h1>
      <p className="text-white/75 text-sm leading-relaxed font-light max-w-xs">
        {SALON.description}
      </p>
    </section>
  )
}
