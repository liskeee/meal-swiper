'use client'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
      <div className="text-center">
        <span className="material-symbols-outlined text-primary text-6xl mb-4 block animate-spin">
          restaurant
        </span>
        <div className="text-xl text-text-primary-light dark:text-text-primary-dark">
          Ładowanie...
        </div>
      </div>
    </div>
  )
}
