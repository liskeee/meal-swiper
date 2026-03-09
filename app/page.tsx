'use client'

import { useState } from 'react'
import type { DayKey, Meal, ViewId } from '@/types'
import { useMeals } from '@/hooks/useMeals'
import { useWeeklyPlan } from '@/hooks/useWeeklyPlan'
import { DAY_KEYS } from '@/lib/utils'
import Navigation from '@/components/Navigation'
import CalendarView from '@/components/CalendarView'
import SwipeView from '@/components/SwipeView'
import ShoppingListView from '@/components/ShoppingListView'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewId>('plan')
  const [currentSwipeDay, setCurrentSwipeDay] = useState<DayKey | null>(null)
  const { meals, loading } = useMeals()
  const {
    weeklyPlan,
    weekOffset,
    setWeekOffset,
    setMeal,
    removeMeal,
    toggleVacation,
  } = useWeeklyPlan()

  const handleDayClick = (day: DayKey) => {
    if (weeklyPlan[`${day}_free`]) return
    setCurrentSwipeDay(day)
    setCurrentView('swipe')
  }

  const handleSwipeRight = (meal: Meal) => {
    let targetDay = currentSwipeDay

    if (!targetDay) {
      targetDay =
        DAY_KEYS.find(
          (d) => !weeklyPlan[d] && !weeklyPlan[`${d}_free`]
        ) ?? null
    }

    if (targetDay) {
      setMeal(targetDay, meal)

      const nextEmptyDay =
        DAY_KEYS.find((d) => {
          if (d === targetDay) return false
          return !weeklyPlan[d] && !weeklyPlan[`${d}_free`]
        }) ?? null

      if (nextEmptyDay) {
        setCurrentSwipeDay(nextEmptyDay)
      } else {
        setTimeout(() => {
          setCurrentView('plan')
          setCurrentSwipeDay(null)
        }, 1500)
      }
    }
  }

  const handleRemoveMeal = (day: DayKey) => {
    removeMeal(day)
  }

  const handleToggleVacation = (day: DayKey) => {
    toggleVacation(day)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex text-text-primary-light dark:text-text-primary-dark">
      <Navigation activeView={currentView} onNavigate={setCurrentView} />

      <main className="flex-1 lg:ml-20 w-full flex flex-col pb-20 lg:pb-0">
        <div className="w-full flex-1 flex flex-col">
          {currentView === 'plan' && (
            <CalendarView
              weeklyPlan={weeklyPlan}
              onDayClick={handleDayClick}
              onRemoveMeal={handleRemoveMeal}
              onToggleVacation={handleToggleVacation}
              onGenerateShoppingList={() => setCurrentView('shopping')}
              weekOffset={weekOffset}
              onWeekChange={setWeekOffset}
            />
          )}

          {currentView === 'swipe' && (
            <SwipeView
              meals={meals}
              onSwipeRight={handleSwipeRight}
              currentDay={currentSwipeDay}
              onComplete={() => {
                setCurrentView('plan')
                setCurrentSwipeDay(null)
              }}
              weeklyPlan={weeklyPlan}
              onSkipAll={() => {
                setCurrentView('plan')
                setCurrentSwipeDay(null)
              }}
            />
          )}

          {currentView === 'shopping' && (
            <ShoppingListView
              weeklyPlan={weeklyPlan}
              weekOffset={weekOffset}
              onWeekChange={setWeekOffset}
            />
          )}
        </div>
      </main>
    </div>
  )
}
