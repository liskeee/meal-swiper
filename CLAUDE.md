# CLAUDE.md — Meal Swiper

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Cloudflare Pages + @cloudflare/next-on-pages
- Cloudflare KV (weekly plans persistence)
- Notion API (meals database, read-only)
- Framer Motion (swipe animations)

## Architektura

```
meal-swiper/
├── app/
│   ├── layout.tsx           # Root layout z AppShell
│   ├── page.tsx             # Redirect do /plan
│   ├── globals.css
│   ├── plan/page.tsx        # Widok kalendarza tygodniowego
│   ├── swipe/page.tsx       # Tinder-style swipe posiłków
│   ├── shopping/page.tsx    # Lista zakupów
│   ├── cooking/page.tsx     # Widok gotowania (DaySelector + CookingView)
│   ├── settings/page.tsx    # Ustawienia (osoby, kcal, białko)
│   └── api/
│       ├── meals/route.ts           # GET — Notion
│       ├── plan/route.ts            # GET/POST — KV
│       ├── shopping-checked/route.ts # GET/POST — KV
│       └── image-search/route.ts    # Google CSE
├── components/
│   ├── AppShell.tsx         # Layout wrapper (header, nav, context)
│   ├── Navigation.tsx       # Mobile bottom nav (4 tabs) + desktop sidebar
│   ├── CalendarView.tsx     # Slim orkiestrator kalendarza
│   ├── SwipeView.tsx        # Slim orkiestrator swipe
│   ├── ShoppingListView.tsx # Lista zakupów z checkboxami
│   ├── MealModal.tsx        # Modal przepisu (people z contextu)
│   ├── CongratulationsToast.tsx
│   ├── cooking/
│   │   └── CookingView.tsx  # UI gotowania (hero + składniki + przepis)
│   ├── plan/
│   │   └── DayCard.tsx      # Karta dnia w kalendarzu
│   ├── swipe/
│   │   ├── SwipeCard.tsx    # Draggable top card
│   │   ├── SwipeStack.tsx   # Stack kart
│   │   └── SwipeActions.tsx # Przyciski ❌ ❤️
│   └── ui/
│       ├── DaySelector.tsx  # Selector Pn-Pt (reusable, swipe + cooking)
│       └── LoadingSpinner.tsx
├── hooks/
│   ├── useMeals.ts          # Fetch posiłków z /api/meals
│   ├── useWeeklyPlan.ts     # Stan planu + localStorage + KV sync
│   ├── useWeekDates.ts      # Obliczenia dat tygodnia
│   ├── useSwipeState.ts     # Stan shufflowanych kart swipe
│   └── useSettings.ts       # Ustawienia użytkownika
├── lib/
│   ├── context.tsx          # AppContext (wiring hooków)
│   ├── notion.ts            # Fetch wrapper dla Notion API
│   ├── storage.ts           # localStorage helpers (typowane)
│   ├── shopping.ts          # Generowanie listy zakupów (merge + scaling)
│   ├── scaling.ts           # Skalowanie składników na osoby
│   ├── recipe.ts            # Parsowanie przepisu z Meal
│   └── utils.ts             # getWeekDates, formatWeekRange, DAY_KEYS, etc.
├── types/
│   └── index.ts             # Meal, Ingredient, WeeklyPlan, DayKey, AppSettings
├── next.config.ts           # Security headers
└── wrangler.toml            # Cloudflare Pages config
```

## Konwencje

- `'use client'` na każdym komponencie z hooks/events
- Edge runtime na API routes (`export const runtime = 'edge'`)
- Typy w `types/index.ts`
- Hooki: jeden hook = jedna odpowiedzialność
- Komponenty: < 200 linii, rozbijaj na podkatalogi (`swipe/`, `plan/`, `cooking/`)
- MealModal pobiera `people` z contextu (nie z propsa)
- Przepisy bazowe są na 2 osoby — skaluj przez `scaleIngredient(ing, people)`

## Uruchomienie

```bash
npm install
cp .dev.vars.example .dev.vars  # uzupełnij env vars
npm run dev
```

## Build & Deploy

```bash
npm run build          # next build (dev check)
npm run pages:build    # @cloudflare/next-on-pages (production)
npm run deploy         # build + wrangler deploy
```

## Env vars (Cloudflare Pages Secrets)

- `NOTION_TOKEN` — Notion integration token
- `MEALS_DB_ID` — Notion database ID z posiłkami
- `GOOGLE_CSE_API_KEY` — Google Custom Search (image fallback)
- `GOOGLE_CSE_CX` — Google Search Engine ID

## Notion — baza posiłków

Pola: Nazwa (title), Opis, Zdjecie (url, Imgur), Czas_przygotowania,
Kcal_baza, Kcal_z_miesem, Bialko_baza, Bialko_z_miesem,
Skladniki_baza (JSON), Skladniki_mieso (JSON), Przepis (JSON),
Trudnosc, Kuchnia, Tagi

Przepisy bazowe są na 2 osoby. App skaluje dynamicznie przez `scaleIngredient`.

## KV

Namespace: `MEAL_PLANS`
Keys: `plan:{weekKey}`, `shopping-checked:{weekKey}`

## Ważne

- `@cloudflare/next-on-pages` max Next.js 15.5.2 (nie 16!)
- Nie używaj `@notionhq/client` (Node.js only, nie działa w edge)
- Zdjęcia posiłków na Imgur (anonymous upload, client_id w `scripts/.env`)
- 63 testy vitest muszą zawsze przechodzić przed commitem
