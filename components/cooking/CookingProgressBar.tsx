'use client'

interface CookingProgressBarProps {
  total: number
  done: number
}

export default function CookingProgressBar({ total, done }: CookingProgressBarProps) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0
  const isComplete = percent === 100

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-500 dark:text-text-secondary-dark">
          Postęp gotowania
        </span>
        <span
          className={`text-xs font-bold transition-colors ${
            isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'
          }`}
        >
          {percent}%
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isComplete ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-primary'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {isComplete && (
        <div className="mt-2 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 animate-pulse">
          <span className="material-symbols-outlined text-[16px]">celebration</span>
          <span className="text-xs font-medium">Danie gotowe! Smacznego 🎉</span>
        </div>
      )}
    </div>
  )
}
