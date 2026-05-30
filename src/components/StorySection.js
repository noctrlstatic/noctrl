"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function StorySection() {
  const stats = [
    { num: "10K+", label: "Community Members" },
    { num: "24h", label: "Shipping" },
    { num: "100%", label: "Authentic Quality" },
  ];

  return (
    <section id="story" className="py-28 relative overflow-hidden">
      <div className="absolute top-[-50%] right-[-30%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(212,197,169,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <span className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#d4c5a9] block mb-4">
            Our Story
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(3.5rem,10vw,8rem)] leading-[0.95] text-white mb-8">
            Built for people<br />
            who move <span className="text-[#d4c5a9]">different.</span>
          </h2>
          <p className="text-base text-gray-400 max-w-xl leading-relaxed mb-10">
            NOCTRL was born from the raw edges of the city. Where concrete meets creativity and
            every street tells a story. We don&apos;t follow trends — we set our own pace. Minimal
            silhouettes, premium fabrics, and uncompromising attention to detail.
            <br />
            <br />
            This isn&apos;t just clothing. It&apos;s a mindset. A statement. A lifestyle for those
            who move different.
          </p>
          <p className="text-[0.7rem] text-[#d4c5a9] mb-3 tracking-[0.1em]">Join now &amp; get <strong className="text-white">10% off</strong> your first order</p>
          <a
            href="#newsletter"
            className="inline-flex items-center gap-2 bg-[#d4c5a9] text-[#0a0a0a] px-9 py-4 rounded text-[0.7rem] font-bold tracking-[0.12em] uppercase transition-all hover:bg-[#e8dcc8] hover:-translate-y-0.5"
          >
            Join the Movement — Subscribe
            <ArrowRight size={16} />
          </a>

          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/[0.04]">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="font-[family-name:var(--font-display)] text-4xl text-white leading-none mb-1">
                  {stat.num}
                </div>
                <div className="text-[0.6rem] text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
