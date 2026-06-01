# NOCTRL — Sito Web Borraccia

## Graphify
Questo progetto ha un grafo della conoscenza in `graphify-out/`. Vedi `../graphify-out/GRAPH_REPORT.md`.

### /graphify commands
- `/graphify query "<domanda>"` — esplora il grafo
- `/graphify path "<A>" "<B>"` — percorso tra due concetti
- `/graphify explain "<X>"` — spiegazione di un nodo
- `/graphify .` — aggiorna grafo dopo modifiche
- `/graphify cluster-only <path>` — visualizzazione

## Architettura
- `src/app/page.js` — orchestratore homepage (377 righe, 8 useEffect, useMemo/useCallback)
- `src/app/admin/page.js` — orchestratore admin (469 righe, server-side auth via `/api/auth`)
- `src/components/` — 15 componenti frontend
- `src/components/admin/` — 8 componenti admin
- `src/lib/` — constants.js, stripe.js, utils.js, auth.js, api-auth.js, email.js, supabase.js
- `src/app/api/` — 9 route: auth, checkout, orders, products, products/[id], subscribers, subscribe, upload, webhook

## Convenzioni
- API routes protette con `requireAdmin()` — header `x-admin-auth`
- Admin password: solo `process.env.ADMIN_PASSWORD` su Vercel (NESSUN fallback hardcoded)
- Login via `/api/auth` POST (server-side validation, password mai esposta in bundle client)
- `NEXT_PUBLIC_META_PIXEL_ID` per Meta Pixel (condizionale: caricato solo se impostato)
- Stripe: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + `STRIPE_SECRET_KEY` in `.env.local`
- Database: Supabase (`NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Stock: validato in `/api/checkout` + decrementato in `/api/orders` POST / webhook
- Webhook Stripe: `/api/webhook` con `STRIPE_WEBHOOK_SECRET`
- Email: Resend con `RESEND_API_KEY`, notifiche a `EMAIL_OWNER`

## Build
- `npm run dev` — sviluppo
- `npm run build` — produzione (Turbopack)

## Completato — Sprint 1 (Maggio 2026)
- Fase 0-5: Refactoring completo, auth middleware, bug fix

## Completato — Sprint 2 (29 Maggio 2026)
- **P1** Stripe checkout: fix localhost fallback + immagini in product_data
- **P2** 4 pagine: `/chi-siamo`, `/spedizioni`, `/privacy`, `/termini` + Footer
- **P3** Meta Pixel condizionale
- **P4** Codice sconto NOCTRL10 (Stripe + banner carrello)
- **P5** Stripe LIVE su Vercel
- **P6** SEO: OpenGraph, sitemap, robots, theme-color, canonical, title template
- **P7** Favicon: 16x16, 32x32, apple-touch-icon

## Completato — Sprint 3 (29 Maggio 2026) — Ottimizzazione & Future-proofing
- **S1** 🔴 Upload API protetta con `requireAdmin()`
- **S2** 🔴 Admin password: rimossa dal bundle client, validata via `/api/auth`, env su Vercel
- **S3** 🔴 Stock validation in checkout + decrement su ordine
- **S4** 🔴 `sizes` prop su tutte le 13 immagini `fill` (performance)
- **S5** 🔴 `www.alibaba.com` rimosso da remotePatterns
- **S6** 🟡 `useMemo`/`useCallback` su page.js (categorie, filtri, carrello, handlers)
- **S7** 🟡 `alert()` rimosso dal Footer
- **S8** 🟡 13 immagini Unsplash sostituite con foto prodotto reali

## Completato — Sprint 4 (29 Maggio 2026) — Backend & Infrastruttura
- **I1** 🔴 Webhook Stripe (`/api/webhook`) — ordini salvati anche se utente chiude browser
- **I2** 🔴 Email conferma — Resend: cliente riceve riepilogo, owner riceve notifica
- **I3** 🔴 Admin UX — Toast moderni (verde/rosso/giallo) al posto di alert/confirm
- **I4** 🔴 Database — Supabase: products, orders, subscribers (niente più JSON)
- **I5** 🟡 Cartella rinominata `sito-web-borraccia` → `noctrl-shop`

## Pagine attive
| Route | Tipo | Note |
|-------|------|------|
| `/` | static | Homepage con carrello, prodotti, sezioni |
| `/chi-siamo` | static | Storia e valori brand |
| `/spedizioni` | static | Spedizioni Italia/Europa, resi |
| `/privacy` | static | Privacy Policy |
| `/termini` | static | Termini e Condizioni |
| `/admin` | static | Pannello admin (login via `/api/auth`) |
| `/sitemap.xml` | static | Sitemap SEO |
| `/robots.txt` | static | Robots |
| `/api/auth` | dynamic | Login admin (POST, server-side validation) |
| `/api/*` | 7 route | checkout, orders, products, products/[id], subscribers, subscribe, upload |

---

## ⚠️ DA FARE PER IL FUTURO — Priorità quando il sito cresce

### 🟡 Importanti
- [ ] **Pagina conferma ordine** — Sostituire `?success=true` con pagina `/success` dedicata
      - Mostrare order ID, riepilogo, data stimata consegna
- [ ] **Accessibilità** — Aggiungere ARIA labels, focus trap su modali, ruoli
      - Componenti: CartDrawer, ProductModal, NewsletterPopup, admin/ProductForm
- [ ] **Meta Pixel** — Creare Business account, prendere ID, impostare su Vercel

### 🟢 Gradevoli
- [ ] **Dominio `noctrl.it`** — Comprare e collegare a Vercel
- [ ] **Immagini Hero** — Sostituire Unsplash con foto NOCTRL reali (se disponibili)
- [ ] **Compressione immagini** — Ottimizzare JPEG prodotto (es. squoosh, sharp)
- [ ] **Unificare lingua** — Alcuni errori API in italiano, altri in inglese
- [ ] **Rimuovere `'use client'`** da componenti statici (LifestyleSection, SocialProof, StorySection, Footer)

---

## Vercel
- Progetto rinominato: `sito-web-borraccia` → **`noctrl-store`**
- Token Vercel salvato in `.env.local` (`VERCEL_TOKEN`)
- URL attuale: `https://noctrl-store.vercel.app` (alias `sito-web-borraccia.vercel.app`)
- `NEXT_PUBLIC_SITE_URL` aggiunto in `.env.local`

## Cleanup (1 Giugno 2026)
- Eliminata dir `sito-web-borraccia/` (vuota)
- Eliminato `RESTRUCTURE_PLAN.md`
- Eliminato `tessere NOCTRL.docx`
- Aggiunto bottone "Aggiungi Prodotto" in ProductTable.js
- Aggiornato link email da `sito-web-borraccia.vercel.app` a `noctrl-store.vercel.app`
- Aggiornato `package.json` name: `sito-web-borraccia` → `noctrl-store`

## Da ricordare
- **Video Lifestyle** — Devo creare video brevi stile lifestyle/streetwear (tipo reel) e caricarli su `public/uploads/video/` per la sezione in basso della homepage
- **Header mobile** — Instagram e User/admin ora visibili sempre (rimosso `hidden sm:block`)
- **Mobile 2 colonne** — Prodotti in griglia 2 colonne su mobile (`grid-cols-2` invece di `grid-cols-1`)
- **Card glow** — Recensioni e prodotti hanno effetto glow oro al hover
- **Supabase SQL** — File `supabase-schema.sql` pronto per creare DB

## Note sullo stato attuale
- **Database**: Supabase (products, orders, subscribers) — niente più file JSON
- **Codice sconto**: NOCTRL10 attivo su Stripe LIVE (`allow_promotion_codes: true`)
- **Webhook Stripe**: attivo su `/api/webhook` con `STRIPE_WEBHOOK_SECRET`
- **Email**: Resend configurato — conferma cliente + notifica owner
- **Admin UX**: Toast invece di alert/confirm
- **Meta Pixel** condizionale (solo se `NEXT_PUBLIC_META_PIXEL_ID` impostato)
- **19 route totali** in build (8 pagine + 1 sitemap + 1 robots + 9 API routes)
- **Zero segreti** nel codice (password, chiavi — tutto in env)
- **Google Fonts**: Bebas Neue + Inter (via link preconnect + next/font)
