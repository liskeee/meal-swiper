'use client'

interface SwipeActionsProps {
  onLeft: () => void
  onRight: () => void
  disabled: boolean
  currentDay: string | null
  onSkipDay: () => void
}

export default function SwipeActions({
  onLeft,
  onRight,
  disabled,
  currentDay,
  onSkipDay,
}: SwipeActionsProps) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0 pb-2">
      <div className="flex items-center justify-center gap-6 sm:gap-8 h-16 sm:h-20">
        <button
          onClick={onLeft}
          disabled={disabled}
          title="Pomiń tę propozycję"
          className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-surface-dark rounded-full shadow-lg flex items-center justify-center text-red-500 border-2 border-red-100 dark:border-red-900/30 transition-transform active:scale-90 hover:scale-105 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-3xl font-bold">close</span>
        </button>
        <button
          onClick={onRight}
          disabled={disabled}
          title="Dodaj do planu"
          className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-full shadow-lg shadow-primary/30 flex items-center justify-center text-white transition-transform active:scale-90 hover:scale-105 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-3xl font-bold">favorite</span>
        </button>
      </div>
      {currentDay && (
        <button
          onClick={onSkipDay}
          className="text-sm text-slate-500 dark:text-text-secondary-dark hover:text-slate-700 dark:hover:text-slate-300 transition-colors py-1"
        >
          Pomiń ten dzień &rarr;
        </button>
      )}
    </div>
  )
}
