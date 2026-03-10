'use client'

interface CategoryFilterProps {
  activeCategories: string[]
  activeCuisines: string[]
  onToggleCategory: (category: string) => void
  onToggleCuisine: (cuisine: string) => void
}

const CATEGORIES = [
  { value: 'makarony', label: '🍝 Makarony' },
  { value: 'ryż i kasze', label: '🍚 Ryż i kasze' },
  { value: 'jednogarnkowe', label: '🥘 Jednogarnkowe' },
  { value: 'tortille i wrapi', label: '🌯 Tortille i wrapi' },
  { value: 'zapiekanki', label: '🫕 Zapiekanki' },
  { value: 'sałatki i bowle', label: '🥗 Sałatki i bowle' },
  { value: 'ziemniaki', label: '🥔 Ziemniaki' },
  { value: 'placki i naleśniki', label: '🥞 Placki i naleśniki' },
]

const CUISINES = [
  { value: 'polska', label: '🇵🇱 Polska' },
  { value: 'włoska', label: '🇮🇹 Włoska' },
  { value: 'azjatycka', label: '🥢 Azjatycka' },
  { value: 'meksykańska', label: '🌮 Meksykańska' },
  { value: 'indyjska', label: '🫙 Indyjska' },
  { value: 'śródziemnomorska', label: '🫒 Śródziemnomorska' },
  { value: 'koreańska', label: '🌶️ Koreańska' },
]

export default function CategoryFilter({
  activeCategories,
  activeCuisines,
  onToggleCategory,
  onToggleCuisine,
}: CategoryFilterProps) {
  return (
    <div className="px-4 py-2 space-y-1.5">
      {/* Categories row */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
        {CATEGORIES.map(({ value, label }) => {
          const active = activeCategories.includes(value)
          return (
            <button
              key={value}
              onClick={() => onToggleCategory(value)}
              className={[
                'flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150',
                active
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 dark:bg-surface-dark dark:text-text-secondary-dark hover:bg-slate-200 dark:hover:bg-border-dark',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Cuisines row */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
        {CUISINES.map(({ value, label }) => {
          const active = activeCuisines.includes(value)
          return (
            <button
              key={value}
              onClick={() => onToggleCuisine(value)}
              className={[
                'flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150',
                active
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 dark:bg-surface-dark dark:text-text-secondary-dark hover:bg-slate-200 dark:hover:bg-border-dark',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
