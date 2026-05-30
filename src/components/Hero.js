"use client";

import Image from "next/image";

export default function Hero({ heroRef }) {
  return (
    <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1920&q=80"
          alt="NOCTRL Streetwear"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.35] saturate-[1.1]"
          priority
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/60 to-[#050505]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-16">
        <div className="max-w-3xl">
          <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#d4c5a9] mb-6 animate-fade-up">
            New Season — Drop 001
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(5rem,15vw,10rem)] leading-[0.9] tracking-[-0.03em] text-white animate-fade-up">
            <span className="block">NOCTRL</span>
            <span className="block">Streetwear</span>
            <span className="block">Essentials</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-lg mt-6 mb-10 leading-relaxed animate-fade-up">
            Minimal urban clothing built for everyday expression.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-up">
            <a
              href="#products"
              className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] px-9 py-4 rounded text-[0.7rem] font-bold tracking-[0.12em] uppercase transition-all hover:bg-[#d4c5a9] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,197,169,0.2)]"
            >
              SHOP NOW
            </a>
            <a
              href="#countdown"
              className="inline-flex items-center gap-2 border border-gray-600 text-white px-9 py-4 rounded text-[0.7rem] font-bold tracking-[0.12em] uppercase transition-all hover:border-white hover:bg-white/5 hover:-translate-y-0.5"
            >
              NEW DROP
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-fade-up">
        <span className="text-[0.55rem] font-semibold tracking-[0.15em] uppercase text-gray-600">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-gray-600 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
