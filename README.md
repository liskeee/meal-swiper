# Meal Swiper

Aplikacja do planowania posiłków na tydzień w stylu Tinder — przesuń w prawo, aby dodać danie do planu, w lewo, aby pominąć.

## Funkcje

- **Plan** — kalendarz tygodniowy (Pn–Pt) z podglądem planu, oznaczaniem wolnych dni i menu kontekstowym
- **Swipe** — przeglądaj dania i wybieraj przesunięciem (drag/strzałki klawiaturowe)
- **Lista zakupów** — automatycznie generowana z planu, skalowana na liczbę osób, z checkboxami i udostępnianiem
- **Gotowanie** — przepis dla wybranego dnia z listą składników (skalowanych) i krokami
- **Ustawienia** — konfiguracja liczby osób i celów kalorycznych

## Stack

- **Next.js 15** (App Router) + **TypeScript** (strict mode)
- **Tailwind CSS 3**
- **Framer Motion** (animacje swipe)
- **@cloudflare/next-on-pages** (edge runtime na Cloudflare Pages)
- **Cloudflare KV** (persystencja planów tygodniowych)
- **Notion API** (baza danych posiłków, czysty fetch bez SDK)

## Architektura

```
┌─────────────────────────────────────────────┐
│              Cloudflare Pages               │
│  ┌────────────────────────────────────────┐  │
│  │         Next.js 15 (App Router)        │  │
│  │                                        │  │
│  │  /plan  /swipe  /shopping              │  │
│  │  /cooking  /settings                   │  │
│  │                                        │  │
│  │  /api/meals     (edge, Notion)         │  │
│  │  /api/plan      (edge, KV)             │  │
│  │  /api/shopping-checked (edge, KV)      │  │
│  │  /api/image-search (edge, Google CSE)  │  │
│  └──────────────┬─────────────────────────┘  │
│                 │                             │
│  @cloudflare/next-on-pages + KV Namespace    │
└─────────────────┼─────────────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │        Notion API         │
    │  (baza danych posiłków)   │
    └───────────────────────────┘
```

## Env vars

| Zmienna              | Opis                             |
| -------------------- | -------------------------------- |
| `NOTION_TOKEN`       | Bearer token do Notion API       |
| `MEALS_DB_ID`        | ID bazy danych posiłków w Notion |
| `GOOGLE_CSE_API_KEY` | Google Custom Search API key     |
| `GOOGLE_CSE_CX`      | Google Custom Search Engine ID   |

## Uruchomienie lokalne

```bash
npm install
cp .dev.vars.example .dev.vars   # uzupełnij env vars
npm run dev
```

Aplikacja dostępna pod `http://localhost:3000`.

## Build & Deploy

```bash
npm run build          # Next.js build (sprawdzenie lokalne)
npm run pages:build    # Build dla Cloudflare Pages
npm run deploy         # Build + wrangler deploy
```

Ustaw env vars w Cloudflare Pages Dashboard → Settings → Environment variables.

## Skrypty

| Skrypt                | Opis                         |
| --------------------- | ---------------------------- |
| `npm run dev`         | Next.js dev server           |
| `npm run build`       | Next.js production build     |
| `npm run pages:build` | Build dla Cloudflare Pages   |
| `npm run deploy`      | Build + deploy na Cloudflare |
| `npm run type-check`  | Sprawdzenie typów TypeScript |
| `npm test`            | Testy Vitest (63 testy)      |
