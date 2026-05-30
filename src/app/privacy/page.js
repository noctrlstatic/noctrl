import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy di NOCTRL. Informazioni su come trattiamo i tuoi dati personali.",
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-[family-name:var(--font-body)] selection:bg-[#d4c5a9] selection:text-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <Link href="/" className="inline-block text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-gray-500 hover:text-[#d4c5a9] transition-colors mb-12">
          &larr; Back to Home
        </Link>

        <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-display)] tracking-[0.03em] leading-none mb-8">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-gray-400 leading-relaxed text-sm md:text-base">
          <p className="text-xs text-gray-600">Ultimo aggiornamento: Maggio 2026</p>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Titolare del Trattamento</h2>
            <p>
              NOCTRL è un brand di proprietà di <strong className="text-white">Cosimo Ricci</strong>.
              Per qualsiasi richiesta relativa alla privacy, puoi contattarci all&apos;indirizzo
              <span className="text-[#d4c5a9]"> noctrlshop@email.com</span>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Dati che Raccogliamo</h2>
            <p>Raccogliamo i seguenti dati personali quando utilizzi il nostro sito:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Nome e cognome (per la spedizione)</li>
              <li>Indirizzo email (per conferme ordine e newsletter)</li>
              <li>Indirizzo di spedizione, città, CAP, telefono</li>
              <li>Dati di navigazione anonimi tramite cookie tecnici</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Come Usiamo i Tuoi Dati</h2>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Elaborazione e spedizione degli ordini</li>
              <li>Comunicazioni relative all&apos;ordine (conferma, aggiornamento spedizione)</li>
              <li>Newsletter (solo con consenso esplicito)</li>
              <li>Miglioramento del sito e dell&apos;esperienza utente</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Pagamenti</h2>
            <p>
              I pagamenti sono gestiti da <strong className="text-white">Stripe</strong>.
              NOCTRL non memorizza né ha accesso ai dati della tua carta di credito.
              Stripe utilizza crittografia SSL e rispetta gli standard PCI DSS.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Cookie</h2>
            <p>
              Utilizziamo solo cookie tecnici necessari al funzionamento del sito.
              Non utilizziamo cookie di profilazione o tracciamento pubblicitario.
              Il sito può utilizzare Meta Pixel solo se fornisci il consenso esplicito.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. I Tuoi Diritti</h2>
            <p>Hai il diritto di:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Richiedere l&apos;accesso ai tuoi dati personali</li>
              <li>Richiedere la rettifica o cancellazione dei dati</li>
              <li>Opporti al trattamento per marketing</li>
              <li>Richiedere la portabilità dei dati</li>
              <li>Revocare il consenso alla newsletter in qualsiasi momento</li>
            </ul>
            <p className="mt-2">
              Per esercitare i tuoi diritti, scrivi a{" "}
              <span className="text-[#d4c5a9]">noctrlshop@email.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
