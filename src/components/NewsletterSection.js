"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input");
    if (!input?.value) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.value }),
      });
      input.value = "";
      setSubscribed(true);
    } catch {}
  };

  return (
    <section id="newsletter" className="py-28 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#d4c5a9] block mb-4">
            Stay Connected
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,6vw,4rem)] text-white mb-4 leading-none">
            Join the <span className="text-[#d4c5a9]">NOCTRL</span> Community
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-8">
            Be the first to know about new drops, exclusive releases, and community events.{' '}
            <strong className="text-white">10% off your first order.</strong>
          </p>
          {subscribed ? (
            <p className="text-[#d4c5a9] font-bold">Benvenuto nella community NOCTRL!</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Inserisci la tua email"
                required
                className="flex-1 bg-[#111] border border-white/10 rounded-lg px-5 py-4 text-sm outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
              />
              <button
                type="submit"
                className="bg-[#d4c5a9] text-[#0a0a0a] px-7 py-4 rounded-lg text-[0.65rem] font-bold uppercase tracking-widest transition-all hover:bg-[#e8dcc8] flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="text-[0.6rem] text-gray-600 mt-4">
            Iscrivendoti accetti la nostra Privacy Policy. Puoi cancellarti in qualsiasi momento.
          </p>
        </div>
      </div>
    </section>
  );
}
