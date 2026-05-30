"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LIFESTYLE_ITEMS } from "@/lib/constants";

export default function LifestyleSection() {
  return (
    <section id="lifestyle" className="py-28 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#d4c5a9] block mb-4">
            Lifestyle
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-white">
            Wear the <span className="text-[#d4c5a9]">Concrete</span>
          </h2>
          <p className="text-gray-400 max-w-lg mt-4 leading-relaxed">
            From the streets to the spotlight. NOCTRL is worn by those who move different.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px] md:auto-rows-[400px]">
          {LIFESTYLE_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                item.tall ? "md:row-span-2" : ""
              } ${item.wide ? "md:col-span-2" : ""}`}
            >
              <Image
                src={item.img}
                alt={item.tag}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-[1]" />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-[2]">
                <div className="text-[0.55rem] font-semibold tracking-[0.15em] uppercase text-[#d4c5a9] mb-3">
                  {item.label}
                </div>
                <div className="font-[family-name:var(--font-display)] text-4xl text-white leading-none mb-2">
                  {item.tag}
                </div>
                {item.text && (
                  <p className="text-sm text-gray-300 max-w-md leading-relaxed">{item.text}</p>
                )}
                {item.subtext && (
                  <p className="text-[0.6rem] text-gray-500 mt-2 tracking-[0.1em]">{item.subtext}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
