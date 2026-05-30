# Piano di Ristrutturazione — NOCTRL

## Stato Attuale

| Metrica | Valore |
|---------|--------|
| `page.js` | 1502 righe (tutto inline) |
| `admin/page.js` | 1458 righe (tutto inline) |
| Componenti React | 0 |
| File morti / duplicati | ~50+ |
| Segreti esposti | 3+ |
| Cartelle `_static_backup/` | ~6MB dead |

---

## Fase 0: Pulizia (sicurezza + file morti)

| Azione | Dettaglio |
|--------|-----------|
| **Crea `.env.local`** | Spostare `STRIPE_SECRET_KEY` da `RIEPILOGO_PROGETTO.md` ed `exAGENTS.md` |
| **Cancellare** | `stripe_backup_code.txt` |
| **Cancellare** | `RIEPILOGO_PROGETTO.md` (contiene Vercel token + Stripe key) |
| **Cancellare** | `exAGENTS.md` (sostituito da `AGENTS.md`, contiene Stripe key) |
| **Cancellare** | `_static_backup/` (intera directory, ~6MB) |
| **Cancellare** | `public/bottiglia.webp` (non referenziata) |
| **Cancellare** | `public/bottle_features.png` (non referenziata) |
| **Cancellare** | `public/bottle_hero.png` (non referenziata) |
| **Cancellare** | `public/bottle_lifestyle.png` (non referenziata) |
| **Aggiornare `.gitignore`** | Aggiungere `_static_backup/`, `graphify-out/`, `graphify/`, `.env.local` |
| **Spostare** | `graphify-out/` → fuori dal progetto o ignorato da git |

---

## Fase 1: Nuova struttura cartelle

```
sito-web-borraccia/src/
├── app/                          # Solo route pages (snelle)
│   ├── layout.js                 # Invariato
│   ├── globals.css               # Invariato
│   ├── page.js                   # Solo import componenti (~20 righe)
│   ├── admin/page.js             # Solo import componenti admin (~20 righe)
│   └── api/                      # Invariato
│
├── components/                   #  *** NUOVO ***
│   ├── Header.js
│   ├── Hero.js
│   ├── CountdownTimer.js
│   ├── ProductCard.js
│   ├── ProductGrid.js
│   ├── ProductModal.js
│   ├── CartDrawer.js
│   ├── SearchOverlay.js
│   ├── NewsletterPopup.js
│   ├── NewsletterSection.js
│   ├── LifestyleSection.js
│   ├── TrendingFits.js
│   ├── SocialProof.js
│   ├── StorySection.js
│   ├── Footer.js
│   └── admin/
│       ├── LoginScreen.js
│       ├── AdminHeader.js
│       ├── StatsGrid.js
│       ├── ProductTable.js
│       ├── ProductForm.js
│       ├── OrderManager.js
│       ├── SubscriberManager.js
│       └── ConfirmDelete.js
│
├── lib/                          #  *** NUOVO ***
│   ├── constants.js              # REVIEWS, LIFESTYLE_ITEMS, TRENDING_FITS, COMMUNITY_GRID
│   ├── stripe.js                 # getStripe() client init
│   ├── auth.js                   # Admin auth helpers
│   └── utils.js                  # Formattazione prezzi, validazione, utility
│
└── data/                         # Invariato (per ora)
    ├── products.json
    ├── orders.json
    └── subscribers.json
```

---

## Fase 2: Refactor `page.js` (1502 → ~20 righe)

Estrarre 15 componenti + 1 constants file:

### `src/lib/constants.js`
- `REVIEWS` (5 recensioni)
- `LIFESTYLE_ITEMS` (3 lifestyle card)
- `TRENDING_FITS` (5 trending fits)
- `COMMUNITY_GRID` (4 immagini community)

### `src/components/`
| Componente | Logica estratta |
|------------|----------------|
| `Header.js` | Header fisso, nav, search toggle, cart icon, admin link |
| `Hero.js` | Hero full-screen con sfondo, titoli, CTA |
| `CountdownTimer.js` | Timer countdown 7 giorni |
| `ProductGrid.js` | Filtri categoria, ordinamento, griglia prodotti |
| `ProductCard.js` | Card singola: immagini hover, badge, quick add, wishlist |
| `ProductModal.js` | Modal dettaglio con immagini multiple |
| `CartDrawer.js` | Drawer carrello, form shipping, checkout Stripe |
| `SearchOverlay.js` | Ricerca prodotti in overlay |
| `LifestyleSection.js` | Lifestyle masonry grid |
| `TrendingFits.js` | Carousel trending fits con frecce |
| `SocialProof.js` | Reviews cards + community instagram grid |
| `StorySection.js` | Storytelling con stats |
| `NewsletterSection.js` | Form newsletter nella pagina |
| `NewsletterPopup.js` | Popup newsletter con timer + exit intent |
| `Footer.js` | Footer completo con link, social, payment icons |

### `page.js` risultante:
```js
"use client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CountdownTimer from "@/components/CountdownTimer";
import ProductGrid from "@/components/ProductGrid";
import LifestyleSection from "@/components/LifestyleSection";
import TrendingFits from "@/components/TrendingFits";
import SocialProof from "@/components/SocialProof";
import StorySection from "@/components/StorySection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductModal from "@/components/ProductModal";
import NewsletterPopup from "@/components/NewsletterPopup";

export default function NOCTRL() {
  // Solo state condiviso: cart, selectedProduct, shipping, search, popup, orderSuccess
  // Passato come props ai componenti figli
  return ( ... );
}
```

---

## Fase 3: Refactor `admin/page.js` (1458 → ~20 righe)

| Componente | Logica estratta |
|------------|----------------|
| `LoginScreen.js` | Form login con password, rememberMe, auth error |
| `AdminHeader.js` | Header con titolo, link shop, logout |
| `StatsGrid.js` | 4 card statistiche (totali, stock, esauriti, scorte basse) |
| `ProductTable.js` | Tabella prodotti desktop + mobile + stock adjustment inline |
| `ProductForm.js` | Modal creazione/modifica: campi, upload immagini, URL |
| `OrderManager.js` | Tabella ordini, cambio stato, tracking |
| `SubscriberManager.js` | Lista subscriber, ricerca, esportazione CSV |
| `ConfirmDelete.js` | Modal conferma eliminazione prodotto |

---

## Fase 4: API Routes — Middleware Auth

- `api/products/route.js` — proteggere POST con password check
- `api/products/[id]/route.js` — proteggere PUT/DELETE
- `api/orders/route.js` — proteggere POST/PUT
- `api/subscribers/route.js` — proteggere DELETE

Implementazione: aggiungere header `x-admin-auth` e validarlo rispetto alla password hashata in `.env.local`.

---

## Fase 5: Miglioramenti minori

| Issue | Fix |
|-------|-----|
| `alert()` nelle form | Sostituire con stato `success`/`error` inline |
| Meta Pixel `YOUR_PIXEL_ID` | Sostituire con `.env` var o rimuovere |
| Validazione input API | Aggiungere sanitizzazione in tutte le route POST/PUT |
| Branding errato "ReviveResell" | `admin/page.js:438` → "NOCTRL Admin" |
| `page.js:175` `fbq` check | Rimuovere o rendere condizionale |
| Hardcoded admin password | Spostare in `.env.local` con fallback |
| `products.json` ID generati | Migliorare logica ID univoci |

---

## Ordine di esecuzione consigliato

```
Fase 0 (Pulizia)
  ↓
Fase 1 (Struttura cartelle)
  ↓
Fase 2 (Refactor page.js → componenti)
  ↓
Fase 3 (Refactor admin/page.js → componenti)
  ↓
Fase 4 (Middleware API auth)
  ↓
Fase 5 (Miglioramenti minori)
```
