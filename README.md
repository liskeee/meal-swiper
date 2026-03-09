# Meal Swiper

Aplikacja do planowania posiłków na tydzień w stylu Tinder — przesuń w prawo, aby dodać danie do planu, w lewo, aby pominąć.

## Funkcje

- **Swipe** — przeglądaj dania i wybieraj przesunięciem (drag/strzałki)
- **Kalendarz tygodniowy** (Pn–Pt) — podgląd planu, oznaczanie wolnych dni
- **Lista zakupów** — automatycznie generowana z planu, z checkboxami i udostępnianiem

## Architektura

```
┌─────────────────────────────────────────────┐
│              Cloudflare Pages               │
│  ┌────────────────────────────────────────┐  │
│  │         Next.js 15 (App Router)       │  │
│  │                                        │  │
│  │  app/                                  │  │
│  │  ├── page.tsx        (SPA, use client) │  │
│  │  └── api/                              │  │
│  │      ├── meals/      (edge runtime)    │  │
│  │      └── image-search/(edge runtime)   │  │
│  │                                        │  │
│  │  components/  hooks/  lib/  types/     │  │
│  └──────────────┬─────────────────────────┘  │
│                 │                             │
│  @cloudflare/next-on-pages (edge Workers)    │
└─────────────────┼─────────────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │        Notion API         │
    │  (baza danych posiłków)   │
    └───────────────────────────┘
```

## Technologie

- **Next.js 15** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS 3**
- **@cloudflare/next-on-pages** (edge runtime)
- **Notion API** (baza posiłków, czysty fetch)
- **localStorage** (plan tygodniowy, checkboxy listy zakupów)

## Env vars

| Zmienna | Opis |
|---------|------|
| `NOTION_TOKEN` | Bearer token do Notion API |
| `MEALS_DB_ID` | ID bazy danych posiłków w Notion |
| `GOOGLE_CSE_API_KEY` | Google Custom Search API key |
| `GOOGLE_CSE_CX` | Google Custom Search Engine ID |

## Uruchomienie lokalne

```bash
# 1. Zainstaluj zależności
npm install

# 2. Skonfiguruj env vars
cp .dev.vars.example .dev.vars
# Uzupełnij wartości w .dev.vars

# 3. Uruchom dev server
npm run dev
```

Aplikacja będzie dostępna pod `http://localhost:3000`.

## Deploy na Cloudflare Pages

```bash
# Build + deploy
npm run deploy

# Lub krok po kroku:
npm run cf:build
wrangler pages deploy .vercel/output/static --project-name meal-swiper
```

Ustaw env vars w Cloudflare Pages Dashboard → Settings → Environment variables.

## Skrypty

| Skrypt | Opis |
|--------|------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Next.js production build |
| `npm run cf:build` | Build dla Cloudflare Pages |
| `npm run deploy` | Build + deploy na Cloudflare |
| `npm run type-check` | Sprawdzenie typów TypeScript |
