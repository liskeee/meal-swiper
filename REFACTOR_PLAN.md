# REFACTOR_PLAN.md — Meal Swiper: Refaktoryzacja i poprawki

> Przeczytaj ten plik w CAŁOŚCI przed wykonaniem jakiegokolwiek działania.
> Działaj etap po etapie. Commituj po każdym etapie.
> Po każdym etapie: `npm run build` musi przejść bez błędów.

---

## KONTEKST

Meal Swiper to apka do planowania posiłków (Next.js 15, TypeScript, Tailwind, Cloudflare Pages + KV, Notion API jako backend posiłków). Projekt po pierwszej fazie developmentu — działa, ale wymaga refaktoryzacji i kilku poprawek UX.

## ETAPY (kolejność obowiązkowa)

---

### ETAP 1: Navigation fix — settings do headera

**Problem:** 5 tabów w bottom nav jest za ciasno na mobile. "Propozycje" i "Ustawienia" mają długie nazwy → różne szerokości.

**Rozwiązanie:**

1. W `components/Navigation.tsx`: usuń `settings` z `navItems` — bottom nav ma mieć TYLKO 4 taby: Plan, Propozycje, Lista, Gotowanie
2. W `components/AppShell.tsx`: dodaj ikonę ⚙️ (settings) w headerze, obok week selectora, po prawej stronie. Link do `/settings`.
3. Mobile bottom nav: taby powinny mieć stałą szerokość (`w-1/4` zamiast `flex-1`) i ustandaryzowany wygląd — każdy tab identycznej szerokości.
4. Etykiety tabów: skróć "Propozycje" → "Swipe", "Gotowanie" → "Gotuj" (tylko w mobile bottom nav, desktop sidebar zostawia pełne nazwy)
5. Desktop sidebar: też 4 pozycje + settings na dole sidebara (oddzielony `mt-auto`)

**Pliki:** `components/Navigation.tsx`, `components/AppShell.tsx`, `types/index.ts` (ViewId — settings zostaje bo strona istnieje, ale nie jest w nav)

Commit: `refactor: move settings to header, standardize 4-tab navigation`

---

### ETAP 2: DaySelector — reusable component + dodaj do Gotowania

**Rozwiązanie:**

1. Utwórz `components/ui/DaySelector.tsx`:

```tsx
interface DaySelectorProps {
  weeklyPlan: WeeklyPlan
  weekDates: Date[]
  selectedDay: DayKey | null
  onSelect: (day: DayKey) => void
  showThumbnails?: boolean // true w SwipeView, false w CookingView
}
```

- Wiersz chipów Pn-Pt z miniaturkami (opcjonalnymi), data, highlight aktywnego
- Wyciągnij logikę z `SwipeView.tsx` (sekcja "Day Selector")

2. W `components/SwipeView.tsx`: zamień inline day selector na `<DaySelector showThumbnails />`

3. W `app/cooking/page.tsx`:
   - Dodaj state: `selectedDay` (domyślnie dzisiejszy dzień z weekday mapping, fallback na pierwszy zaplanowany)
   - Dodaj `<DaySelector>` pod hero albo zamiast hero (nad przepisem)
   - Zmieniaj posiłek wyświetlany w przepisie na podstawie `selectedDay`
   - Resetuj checkboxy (kroki + składniki) przy zmianie dnia
   - Pobierz `weekDates` z `useWeekDates(weekOffset)` hooka (potrzebujesz `weekOffset` z context)

Commit: `feat: reusable DaySelector, add day switching to cooking view`

---

### ETAP 3: Skalowanie proporcji wszędzie

**Problem:** kcal/białko na kartach są statyczne. Lista zakupów nie skaluje składników.

**Rozwiązanie:**

1. W `components/SwipeView.tsx` — na karcie posiłku:
   - Pokaż przeskalowane kcal: `Math.round(meal.kcal_baza * settings.people / 2)` (przepisy bazowe są na 2 osoby)
   - Dodaj małe badge obok kcal: "dla X os."

2. W `components/CalendarView.tsx` — w karcie dnia:
   - Pokaż przeskalowane kcal analogicznie

3. W `lib/shopping.ts` — funkcja `generateShoppingList`:
   - Dodaj parametr `people: number` (default 2)
   - Przed agregacją składników, przeskaluj każdy przez `scaleIngredient(ing, people)`
   - Zaktualizuj wywołania w `components/ShoppingListView.tsx` — przekaż `settings.people`

4. W `components/ShoppingListView.tsx`:
   - Dodaj dostęp do settings z context: `const { settings } = useAppContext()`
   - Przekaż `settings.people` do `generateShoppingList`

Commit: `feat: scale kcal and shopping list based on settings`

---

### ETAP 4: Refaktoryzacja — rozbij mega-komponenty

#### 4a) Rozbij SwipeView.tsx (523 linii → ~4 pliki)

Utwórz katalog `components/swipe/`:

1. `components/swipe/SwipeCard.tsx` (~120 linii):
   - Props: `meal: Meal`, `x: MotionValue`, `rotate`, `likeOpacity`, `nopeOpacity`, `onDragEnd`, `onPointerDown`, `onPointerUp`, `people: number`
   - Renderuje: zdjęcie, gradient, overlays DODAJ/POMIJAM, info (nazwa, opis, kcal, czas)
   - To jest ta `motion.div` z `isTop` brancha

2. `components/swipe/SwipeStack.tsx` (~60 linii):
   - Props: `cards: Meal[]`, `currentIndex: number`, framer-motion values, handlers
   - Renderuje stack: top card jako SwipeCard + tło karty (scale/opacity)

3. `components/swipe/SwipeActions.tsx` (~40 linii):
   - Props: `onLeft`, `onRight`, `disabled`, `currentDay`, `onSkipDay`
   - Przyciski ❌ ❤️ + "Pomiń ten dzień"

4. `components/SwipeView.tsx` — slim orkiestrator (~150 linii):
   - Importuje SwipeStack, SwipeActions, DaySelector
   - Zawiera logikę animacji, toasty, modal
   - Dużo mniej JSX

#### 4b) Rozbij CalendarView.tsx (274 linii)

Utwórz katalog `components/plan/`:

1. `components/plan/DayCard.tsx` (~100 linii):
   - Props: `day: DayKey`, `meal: Meal | null`, `isFree: boolean`, `dateStr`, `dayName`, `onDayClick`, `onRemoveMeal`, `onToggleVacation`, `onMealClick`, `people: number`
   - Jeden komponent z branching wewnątrz (free / meal / empty)
   - Zawiera menu dropdown (more_vert)

2. `components/CalendarView.tsx` — slim (~80 linii):
   - Grid + mapuje DayCard dla każdego dnia
   - MealModal na dole

#### 4c) Wydziel logikę cooking

1. Utwórz `lib/recipe.ts`:
   - `parseRecipe(meal: Meal): { steps: string[], tips: string, baseIngredients: Ingredient[], meatIngredients: Ingredient[] }`
   - Wyciągnij parsowanie JSON ze składnikami i przepisem (powtarza się w CookingPage i MealModal)

2. Utwórz `components/cooking/CookingView.tsx`:
   - Przenieś UI z `app/cooking/page.tsx`
   - Props: `meal: Meal`, `people: number`

3. `app/cooking/page.tsx` — slim page:
   - DaySelector + CookingView

#### 4d) Ujednolić MealModal

- Usuń prop `people?` — ZAWSZE bierz z context (`useAppContext`)
- Użyj `parseRecipe()` z `lib/recipe.ts` zamiast inline parsowania

Commit: `refactor: break up SwipeView, CalendarView, CookingPage into smaller components`

---

### ETAP 5: Rozbij context + cleanup

#### 5a) Slim context

`lib/context.tsx` eksponuje za dużo (20+ pól). Rozdziel:

1. `hooks/useSwipeState.ts` — NOWY (zastępuje stary nieużywany `useSwipe.ts`):
   - `shuffledMeals`, `currentSwipeIndex`, `seenIds`
   - `shuffleMeals(meals)`, `advanceIndex()`, `resetSwipe()`
   - Inicjalizacja + reset przy zmianie tygodnia

2. `lib/context.tsx` — slim provider:
   - Wywołuje `useMeals()`, `useWeeklyPlan()`, `useSettings()`, `useSwipeState()`
   - Łączy w jeden kontekst, ale kod jest krótki (tylko wiring)
   - `handleSwipeRight` zostaje tutaj (łączy swipe + plan)

#### 5b) Cleanup plików

- Usuń `hooks/useSwipe.ts` (nieużywany — SwipeView używa framer-motion)
- Usuń `screenshots/` z repo: `git rm -r screenshots/` + dodaj do `.gitignore`
- Usuń `public/meals/` jeśli zdjęcia są na Imgur (sprawdź czy frontend ich nie używa!)
- Sprawdź `scripts/` — zostaw `generate-meals.js` i jego libs, usuń resztę jeśli zbędna

Commit: `refactor: slim context, cleanup unused files`

---

### ETAP 6: Aktualizacja dokumentacji

#### CLAUDE.md — napisz od zera:

```markdown
# CLAUDE.md — Meal Swiper

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Cloudflare Pages + @cloudflare/next-on-pages
- Cloudflare KV (weekly plans persistence)
- Notion API (meals database, read-only)
- Framer Motion (swipe animations)

## Architektura

[tu wstaw aktualny diagram katalogów — po refaktoryzacji]

## Konwencje

- 'use client' na każdym komponencie z hooks/events
- Edge runtime na API routes (export const runtime = 'edge')
- Typy w types/index.ts
- Hooki: jeden hook = jedna odpowiedzialność
- Komponenty: < 200 linii, rozbijaj na podkatalogi (swipe/, plan/, cooking/)

## Uruchomienie

npm install
cp .dev.vars.example .dev.vars # uzupełnij env vars
npm run dev

## Build & Deploy

npm run build # next build (dev check)
npm run pages:build # @cloudflare/next-on-pages (production)
npm run deploy # build + wrangler deploy

## Env vars (Cloudflare Pages Secrets)

- NOTION_TOKEN — Notion integration token
- MEALS_DB_ID — Notion database ID z posiłkami
- GOOGLE_CSE_API_KEY — Google Custom Search (image fallback)
- GOOGLE_CSE_CX — Google Search Engine ID

## Notion — baza posiłków

Pola: Nazwa (title), Opis, Zdjecie (url, Imgur), Czas_przygotowania,
Kcal_baza, Kcal_z_miesem, Bialko_baza, Bialko_z_miesem,
Skladniki_baza (JSON), Skladniki_mieso (JSON), Przepis (JSON),
Trudnosc, Kuchnia, Tagi

Przepisy bazowe są na 2 osoby. App skaluje dynamicznie.

## KV

Namespace: MEAL_PLANS
Keys: plan:{weekKey}, shopping-checked:{weekKey}

## Ważne

- @cloudflare/next-on-pages max Next.js 15.5.2 (nie 16!)
- Nie używaj @notionhq/client (Node.js only, nie działa w edge)
- Zdjęcia posiłków na Imgur (anonymous upload, client_id w scripts/.env)
```

#### README.md — zaktualizuj:

- Opis funkcji: Plan, Swipe, Lista zakupów, Gotowanie, Ustawienia
- Stack
- Jak uruchomić

#### TESTS_SPEC.md — sprawdź aktualność, zaktualizuj jeśli trzeba

Commit: `docs: rewrite CLAUDE.md, update README and TESTS_SPEC`

---

### ETAP 7: Final build + push

1. `npm run build` — musi przejść czysto
2. `npm run pages:build` — musi przejść czysto
3. Sprawdź że żadne testy nie są zepsute: `npm test`
4. `git push origin master`

Po zakończeniu:

```bash
openclaw system event --text "Meal Swiper: refaktoryzacja zakończona — 7 etapów, wszystko spushowane" --mode now
```

---

## ZASADY

1. NIE zmieniaj designu/kolorów — refaktoryzacja kodu, nie UI redesign
2. NIE dodawaj nowych dependencies (chyba że absolutnie konieczne)
3. Po KAŻDYM etapie: `npm run build` + commit
4. Zachowaj WSZYSTKIE istniejące testy (63 testy muszą dalej przechodzić)
5. Jeśli test się psuje — napraw test LUB kod, nie usuwaj testu
6. Zachowaj logikę localStorage + KV sync
7. Commit messages po polsku lub angielsku, ale sensowne
