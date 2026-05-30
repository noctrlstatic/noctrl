import Link from "next/link";

export const metadata = {
  title: "Spedizioni e Resi",
  description: "Informazioni su spedizioni, tempi di consegna e resi per i prodotti NOCTRL.",
};

export default function Spedizioni() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-[family-name:var(--font-body)] selection:bg-[#d4c5a9] selection:text-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <Link href="/" className="inline-block text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-gray-500 hover:text-[#d4c5a9] transition-colors mb-12">
          &larr; Back to Home
        </Link>

        <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-display)] tracking-[0.03em] leading-none mb-8">
          Spedizioni e Resi
        </h1>

        <div className="space-y-8 text-gray-400 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Spedizione Italia</h2>
            <p>
              La spedizione standard in Italia costa <strong className="text-white">€5,90</strong> ed è gratuita
              per ordini superiori a <strong className="text-white">€80</strong>.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Consegna in 2-5 giorni lavorativi ( corriere espresso )</li>
              <li>Spedizione tracciabile con codice di tracking via email</li>
              <li>Consegna anche in punti di ritiro ( fermo Posta )</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Spedizione Europa</h2>
            <p>
              Spediamo in tutta Europa con costi variabili in base al paese e al peso del pacco.
              Il calcolo viene mostrato al checkout prima del pagamento.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Consegna in 5-12 giorni lavorativi</li>
              <li>Dazi doganali eventuali a carico del destinatario</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Resi e Rimborsi</h2>
            <p>
              Hai <strong className="text-white">14 giorni</strong> dalla ricezione del pacco per richiedere un reso.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Il prodotto deve essere nelle condizioni originali, non indossato e con tutti i tag</li>
              <li>Le spese di reso sono a carico del cliente (€7,50 Italia, variabile per l&apos;Europa)</li>
              <li>Il rimborso viene elaborato entro 5 giorni dalla ricezione del reso</li>
              <li>Per articoli in saldo o in promozione, il reso non è accettato</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Come fare un reso</h2>
            <ol className="list-decimal list-inside mt-2 space-y-2 text-gray-500">
              <li>Contattaci via email a <span className="text-[#d4c5a9]">noctrlshop@email.com</span> con il numero d&apos;ordine</li>
              <li>Riceverai l&apos;etichetta di reso da stampare e attaccare sul pacco</li>
              <li>Consegna il pacco al corriere indicato</li>
              <li>Riceverai conferma del rimborso entro 5 giorni</li>
            </ol>
          </section>

          <section className="border-t border-white/[0.06] pt-8">
            <p className="text-gray-500 text-xs">
              Per qualsiasi domanda, contattaci all&apos;indirizzo{" "}
              <span className="text-[#d4c5a9]">noctrlshop@email.com</span>.
              Rispondiamo entro 24 ore.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
