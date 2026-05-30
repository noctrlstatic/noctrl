"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { TRENDING_FITS } from "@/lib/constants";

export default function TrendingFits({ carouselRef }) {
  return (
    <section className="py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <span className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#d4c5a9] block mb-4">
          Trending Fits
        </span>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-white">
          #NOCTRL <span className="text-[#d4c5a9]">Fits</span>
        </h2>
      </div>

      <div className="relative">
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto px-6 no-scrollbar scroll-smooth pb-4"
        >
          {TRENDING_FITS.map((fit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex-shrink-0 w-[280px] sm:w-[320px] bg-[#0a0a0a] rounded-2xl overflow-hidden group cursor-pointer border border-white/[0.04]"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={fit.img}
                  alt={fit.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-110">
                    <Play size={20} className="text-white ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-semibold text-white">{fit.title}</h3>
                <p className="text-[0.65rem] text-gray-500 mt-1">{fit.items}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => {
            if (carouselRef.current) carouselRef.current.scrollBy({ left: -340, behavior: "smooth" });
          }}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => {
            if (carouselRef.current) carouselRef.current.scrollBy({ left: 340, behavior: "smooth" });
          }}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
