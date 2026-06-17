import React from 'react'
const images = [
  {
    src: "https://images.unsplash.com/photo-1470259078422-826894b933aa?w=800&h=600&fit=crop",
    alt: "Interior do salão",
    className: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
    alt: "Arte nas unhas",
    className: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=300&fit=crop",
    alt: "Cabelo encaracolado natural",
    className: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
    alt: "Coloração capilar",
    className: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=400&h=300&fit=crop",
    alt: "Cabelo colorido",
    className: "col-span-1 row-span-1",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="bg-[#111111] py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#d84d8a] text-xs tracking-[0.4em] uppercase font-semibold mb-3 font-['Cormorant_Garamond']">
            Nosso Portfolio
          </p>
          <h2 className="text-white text-4xl md:text-5xl font-bold font-['Playfair_Display']">
            Transformações impressionantes
          </h2>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[600px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`${img.className} relative group overflow-hidden rounded-2xl bg-[#1a1a1a]`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#d84d8a]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <span className="text-white text-xs tracking-widest uppercase font-semibold bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  Serviço no salão
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-[#d84d8a] hover:text-white border border-[#d84d8a] hover:bg-[#d84d8a] px-8 py-3 rounded-full text-sm tracking-widest uppercase font-semibold transition-all duration-300"
          >
            Comece sua Transformação
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}