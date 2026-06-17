import React from 'react'
import { FaScissors } from "react-icons/fa6";
import { FaPaintBrush } from "react-icons/fa";
import { PiHairDryer } from "react-icons/pi";
import { GiComb, GiWaterDrop } from "react-icons/gi";
import { RiInkBottleLine } from "react-icons/ri";
const services = [
  {
    icon: <FaScissors size={32} />,
    title: "Cortes",
    description:
      "Cortes personalizados que realçam o seu rosto e estilo de vida.",
  },
  {
    icon: <FaPaintBrush size={32} />,
    title: "Pinturas",
    description:
      "Cor vibrante e duradoura, desde madeixas subtis até transformações completas. Apenas produtos premium.",
  },
  {
    icon: <PiHairDryer size={32} />,
    title: "Progressivas",
    description:
      "Tratamentos alisantes e disciplinantes para reduzir o volume e prolongar o efeito liso com brilho.",
  },
  {
    icon: <GiComb size={32} />,
    title: "Escovas",
    description:
      "Escovas modeladoras e penteados com acabamento profissional para o dia a dia ou eventos.",
  },
  {
    icon: <RiInkBottleLine size={32} />,
    title: "Botox",
    description:
      "Reposição de massa e selagem das cutículas para fios mais macios, sedosos e com menos frizz.",
  },
    {
    icon: <GiWaterDrop size={32} />,
    title: "Hidratação",
    description:
      "Máscaras e nutrição profunda da raiz às pontas para cabelo saudável e luminoso.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-[#6b1f4e] py-24 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-black/20 translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#f7a8cc] text-xs tracking-[0.4em] uppercase font-semibold mb-3 font-['Cormorant_Garamond']">
            O que oferecemos
          </p>
          <h2 className="text-white text-4xl md:text-5xl font-bold font-['Playfair_Display']">
            Todos os Nossos Serviços
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-[#f7a8cc]/40 rounded-2xl p-8 text-center transition-all duration-400 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/30 cursor-pointer"
            >
              <div className="text-[#f7a8cc] group-hover:text-white transition-colors duration-300 flex justify-center mb-5">
                {service.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-3 font-['Playfair_Display']">
                {service.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed font-['Cormorant_Garamond'] text-base">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}