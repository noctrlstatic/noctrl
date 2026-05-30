import Link from "next/link";

export const metadata = {
  title: "Termini e Condizioni",
  description: "Termini e condizioni di vendita di NOCTRL Streetwear Essentials.",
};

export default function Termini() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-[family-name:var(--font-body)] selection:bg-[#d4c5a9] selection:text-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <Link href="/" className="inline-block text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-gray-500 hover:text-[#d4c5a9] transition-colors mb-12">
          &larr; Back to Home
        </Link>

        <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-display)] tracking-[0.03em] leading-none mb-8">
          Termini e Condizioni
        </h1>

        <div className="space-y-6 text-gray-400 leading-relaxed text-sm md:text-base">
          <p className="text-xs text-gray-600">Ultimo aggiornamento: Maggio 2026</p>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Accettazione</h2>
            <p>
              Utilizzando il sito noctrl.it e acquistando i nostri prodotti, accetti i presenti
              Termini e Condizioni. Se non accetti, ti preghiamo di non utilizzare il sito.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Ordini</h2>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Effettuando un ordine, ti impegni ad acquistare il prodotto al prezzo indicato</li>
              <li>Ci riserviamo il diritto di rifiutare o cancellare un ordine per qualsiasi motivo</li>
              <li>In caso di indisponibilità del prodotto, ti rimborseremo l&apos;intero importo</li>
              <li>I prezzi sono in Euro (€) e includono IVA</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Disponibilità</h2>
            <p>
              Tutti i prodotti sono in edizione limitata. Una volta esauriti, potrebbero non essere
              più disponibili. Le quantità indicate sul sito sono indicative e possono variare.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Prezzi e Promozioni</h2>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>I prezzi possono essere modificati senza preavviso</li>
              <li>Le promozioni sono valide fino a esaurimento scorte o fino alla data indicata</li>
              <li>Non è possibile cumulare più codici sconto nello stesso ordine</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Responsabilità</h2>
            <p>
              NOCTRL non è responsabile per danni indiretti derivanti dall&apos;uso dei prodotti
              acquistati. La nostra responsabilità massima è limitata al prezzo di acquisto del
              prodotto.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Contatti</h2>
            <p>
              Per qualsiasi domanda relativa ai Termini e Condizioni, contattaci a{" "}
              <span className="text-[#d4c5a9]">noctrlshop@email.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
