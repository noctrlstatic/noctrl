import Link from "next/link";

export const metadata = {
  title: "Chi Siamo",
  description: "La storia di NOCTRL. Minimal streetwear essentials, built for those who move different.",
};

export default function ChiSiamo() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-[family-name:var(--font-body)] selection:bg-[#d4c5a9] selection:text-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <Link href="/" className="inline-block text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-gray-500 hover:text-[#d4c5a9] transition-colors mb-12">
          &larr; Back to Home
        </Link>

        <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-display)] tracking-[0.03em] leading-none mb-8">
          Chi Siamo
        </h1>

        <div className="space-y-6 text-gray-400 leading-relaxed text-sm md:text-base">
          <p>
            NOCTRL nasce dall&apos;idea che l&apos;abbigliamento non debba gridare per farsi sentire.
            Ogni capo è pensato per chi si muove diverso, per chi vive nella realtà e non nella
            messinscena dei social.
          </p>

          <p>
            Siamo un brand di streetwear essentials con sede in Italia. Produciamo capi minimi,
            senza loghi invadenti, con materiali che durano. Niente hype, niente drop esagerati —
            solo vestiti che funzionano davvero.
          </p>

          <p>
            Ogni collezione è limitata e pensata per accompagnarti nella vita di tutti i giorni.
            Dalla strada alla città, dal lavoro al tempo libero. NOCTRL è per chi non ha bisogno
            di approvazione esterna.
          </p>

          <div className="border-t border-white/[0.06] pt-8 mt-12">
            <h2 className="text-2xl font-[family-name:var(--font-display)] tracking-[0.05em] text-white mb-4">
              Il Nostro Valore
            </h2>
            <ul className="space-y-3">
              {[
                { label: "Qualità", desc: "Materiali selezionati, produzione attenta, capi che durano." },
                { label: "Essenzialità", desc: "Design minimale, niente di superfluo. Ogni dettaglio ha uno scopo." },
                { label: "Autenticità", desc: "Nessuna finzione. Siamo quello che facciamo, non quello che raccontiamo." },
              ].map((item) => (
                <li key={item.label} className="flex gap-4">
                  <span className="text-[#d4c5a9] font-bold text-sm w-24 flex-shrink-0">{item.label}</span>
                  <span className="text-gray-500">{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
