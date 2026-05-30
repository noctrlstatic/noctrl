"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { REVIEWS, COMMUNITY_GRID } from "@/lib/constants";

export default function SocialProof() {
  return (
    <section className="py-28 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#d4c5a9] block mb-4">
            Social Proof
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-white">
            Worn by the <span className="text-[#d4c5a9]">Community</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111] border border-white/[0.04] rounded-2xl p-7 hover:border-[#d4c5a9]/30 hover:shadow-[0_0_30px_rgba(212,197,169,0.08)] transition-all hover:-translate-y-1"
            >
              <div className="text-[#d4c5a9] text-sm tracking-wider mb-3">
                {"★".repeat(review.stars)}
              </div>
              <p className="text-sm text-gray-200 leading-relaxed mb-5">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-700 overflow-hidden relative">
                  <Image src={review.avatar} alt={review.name} fill sizes="36px" className="object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{review.name}</div>
                  <div className="text-[0.6rem] text-gray-500">{review.handle}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12">
          {COMMUNITY_GRID.map((img, i) => (
            <motion.a
              key={i}
              href="https://www.instagram.com/_noctrl_static/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer block"
            >
              <Image src={img} alt={`Community ${i}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Instagram size={24} className="text-white" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
