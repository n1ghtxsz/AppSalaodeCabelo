import React from 'react'
export default function About() {
  return (
    <section id="about" className="bg-[#0d0d0d] py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden h-[500px] bg-[#1a0a14]">
              <img
                src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=700&h=600&fit=crop"
                alt="Profissional a trabalhar"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative border */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-[#d84d8a]/30 rounded-3xl -z-10" />
            {/* Badge */}
            <div className="absolute top-6 -right-4 bg-[#1a0a14] border border-[#d84d8a]/40 text-white rounded-2xl px-5 py-4 shadow-xl">
              <p className="text-[#d84d8a] text-3xl font-bold font-['Playfair_Display']">2010</p>
              <p className="text-white/60 text-xs tracking-widest uppercase mt-0.5">Desde</p>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <p className="text-[#d84d8a] text-xs tracking-[0.4em] uppercase font-semibold mb-4 font-['Cormorant_Garamond']">
              Nossa História
            </p>
            <h2 className="text-white text-4xl md:text-5xl font-bold font-['Playfair_Display'] leading-tight mb-6">
              Arte capilar de excelência desde 2010
            </h2>

            <p className="text-white/60 text-lg font-['Cormorant_Garamond'] leading-relaxed mb-5">
              Na Mary Cabeleireira, acreditamos que o seu cabelo é o seu melhor acessório. A nossa equipa
              forma-se continuamente nas últimas tendências para lhe oferecer estilos de vanguarda
              num ambiente luxuoso e acolhedor.
            </p>
            <p className="text-white/60 text-lg font-['Cormorant_Garamond'] leading-relaxed mb-10">
              Utilizamos apenas produtos premium para preservar a saúde e o brilho do seu cabelo,
              com uma experiência personalizada à medida das suas necessidades.
            </p>

            {/* Feature list */}
            <ul className="space-y-3 mb-10">
              {[
                "Apenas linhas de produtos premium",
                "Consultas personalizadas",
                "Profissionais em formação contínua",
                "Ambiente relaxante e sofisticado",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/80 font-['Cormorant_Garamond'] text-lg">
                  <span className="w-5 h-5 rounded-full bg-[#d84d8a]/20 border border-[#d84d8a] flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-[#d84d8a]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-[#d84d8a] hover:bg-[#c03a77] text-white px-8 py-3.5 rounded-full text-sm tracking-widest uppercase font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-[#d84d8a]/40"
            >
              Saber mais
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}