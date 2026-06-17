import { useEffect, useRef } from "react";
import React from 'react'
export default function Hero() {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(40px)";
      setTimeout(() => {
        el.style.transition = "opacity 1s ease, transform 1s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 100);
    }
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen bg-[#1a1a1a] flex items-center overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] via-[#1a0a14] to-[#2d0d24] z-0" />

      {/* Decorative circle */}
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#d84d8a]/10 blur-3xl z-0 animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-[#7b2d5e]/10 blur-3xl z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div ref={textRef}>
            <p className="text-[#d84d8a] text-xs tracking-[0.4em] uppercase font-semibold mb-4 font-['Cormorant_Garamond']">
              Cuidado Capilar Premium
            </p>

            <h1 className="font-['Playfair_Display'] font-bold leading-tight mb-2">
              <span className="text-white text-5xl md:text-7xl block">Descubra Sua</span>
              <span
                className="text-5xl md:text-7xl block italic"
                style={{
                  background: "linear-gradient(135deg, #d84d8a, #f07ab0, #c03a77)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Verdadeira Beleza
              </span>
            </h1>

            <p className="text-white/60 text-base md:text-lg leading-relaxed mt-6 mb-10 max-w-md font-['Cormorant_Garamond'] text-xl">
              Desfrute de serviços de luxo em penteados e coloração em um ambiente projetado
              para o seu conforto e transformação. Nossos estilistas especializados dedicam-se
              a dar vida à sua visão.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#services"
                className="bg-[#d84d8a] hover:bg-[#c03a77] text-white px-8 py-3.5 rounded-full text-sm tracking-widest uppercase font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-[#d84d8a]/40 hover:-translate-y-1"
              >
                Explore Serviços
              </a>
              <a
                href="#gallery"
                className="border border-white/30 hover:border-[#d84d8a] text-white hover:text-[#d84d8a] px-8 py-3.5 rounded-full text-sm tracking-widest uppercase font-semibold transition-all duration-300"
              >
                Ver a Galeria
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-14 pt-10 border-t border-white/10">
              {[
                { value: "15+", label: "Anos de Experiência" },
                { value: "5mil+", label: "Clientes Satisfeitos" },
                { value: "1", label: "Especialista" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-[#d84d8a] text-3xl font-bold font-['Playfair_Display']">{stat.value}</p>
                  <p className="text-white/50 text-xs tracking-widest uppercase mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image Grid */}
          <div className="relative hidden lg:grid grid-cols-2 gap-4">
            <div className="col-span-1 space-y-4">
              <div className="rounded-2xl overflow-hidden h-64 bg-gradient-to-br from-[#2d0d24] to-[#4a1540] flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop"
                  alt="Interior do salão"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-40 bg-gradient-to-br from-[#1a0a14] to-[#2d0d24]">
                <img
                  src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=200&fit=crop"
                  alt="Estilização capilar"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
                />
              </div>
            </div>
            <div className="col-span-1 space-y-4 mt-8">
              <div className="rounded-2xl overflow-hidden h-40 bg-gradient-to-br from-[#2d0d24] to-[#4a1540]">
                <img
                  src="https://images.unsplash.com/photo-1487412947147-5cebf96b3db7?w=400&h=200&fit=crop"
                  alt="Tratamento de beleza"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-64 bg-gradient-to-br from-[#1a0a14] to-[#2d0d24]">
                <img
                  src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=300&fit=crop"
                  alt="Coloração"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
                />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-6 bg-[#d84d8a] text-white rounded-2xl p-4 shadow-xl shadow-[#d84d8a]/30">
              <p className="text-xs tracking-widest uppercase font-semibold">Mais bem avaliado</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 fill-yellow-300" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/80 text-xs mt-0.5">4.9 / 5.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll CTA */}
      <a
        href="#services"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40 hover:text-[#d84d8a] transition-colors group"
      >
        <span className="text-xs tracking-[0.3em] uppercase">Ver Todos os Serviços</span>
        <svg
          className="w-4 h-4 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
}
