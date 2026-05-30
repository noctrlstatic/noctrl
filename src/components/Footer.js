"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
  const columns = [
    {
      title: "Quick Links",
      links: [
        { name: "Shop All", href: "#drop" },
        { name: "New Drop", href: "#drop" },
        { name: "Trending", href: "#drop" },
        { name: "Our Story", href: "/chi-siamo" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Size Guide", href: null },
        { name: "Shipping Info", href: "/spedizioni" },
        { name: "Returns", href: "/spedizioni" },
        { name: "Contact", href: "mailto:noctrlshop@email.com" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/termini" },
        { name: "Cookie Policy", href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="py-20 bg-[#050505] border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="text-3xl font-[family-name:var(--font-display)] tracking-[0.05em] text-white leading-none block mb-4">
              NOCTRL
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Minimal streetwear essentials. Built for those who move different. Premium urban
              clothing for everyday expression.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.instagram.com/_noctrl_static/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/[0.06] flex items-center justify-center text-gray-400 hover:border-[#d4c5a9] hover:bg-[#d4c5a9]/5 transition-all"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://tiktok.com/@noctrl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/[0.06] flex items-center justify-center text-gray-400 hover:border-[#d4c5a9] hover:bg-[#d4c5a9]/5 transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M9 12a4 4 0 100 8 4 4 0 000-8zm0 0V4h6v2a4 4 0 004 4v4"/></svg>
              </a>
              <a
                href="https://twitter.com/noctrl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/[0.06] flex items-center justify-center text-gray-400 hover:border-[#d4c5a9] hover:bg-[#d4c5a9]/5 transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-white mb-6">
                {col.title}
              </h4>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    {link.href ? (
                      <a href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                        {link.name}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500 cursor-not-allowed">
                        {link.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/[0.04]">
          <p className="text-[0.65rem] text-gray-600">
            &copy; 2026 NOCTRL. All rights reserved.
          </p>
          <div className="flex gap-3">
            <svg viewBox="0 0 36 24" className="w-9 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="3" width="34" height="18" rx="3" />
              <path d="M12 12h12M15 9l-3 3 3 3M21 9l3 3-3 3" />
            </svg>
            <svg viewBox="0 0 36 24" className="w-9 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="3" width="34" height="18" rx="3" />
              <circle cx="14" cy="12" r="4" />
              <circle cx="22" cy="12" r="4" />
            </svg>
            <svg viewBox="0 0 36 24" className="w-9 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="3" width="34" height="18" rx="3" />
              <circle cx="12" cy="12" r="3" />
              <circle cx="24" cy="12" r="3" />
            </svg>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/admin" className="text-[0.55rem] text-gray-700 hover:text-gray-500 uppercase tracking-widest transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
