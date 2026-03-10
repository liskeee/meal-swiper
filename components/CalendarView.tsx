'use client'

import { useState } from 'react'
import type { Meal, DayKey, WeeklyPlan } from '@/types'
import { useWeekDates } from '@/hooks/useWeekDates'
import { DAY_KEYS, DAY_NAMES, formatDateShort } from '@/lib/utils'
import MealModal from '@/components/MealModal'
import DayCard from '@/components/plan/DayCard'
import { useAppContext } from '@/lib/context'

interface CalendarViewProps {
  weeklyPlan: WeeklyPlan
  weekOffset: number
  onDayClick: (day: DayKey) => void
  onRemoveMeal: (day: DayKey) => void
  onToggleVacation: (day: DayKey) => void
}

export default function CalendarView({
  weeklyPlan,
  weekOffset,
  onDayClick,
  onRemoveMeal,
  onToggleVacation,
}: CalendarViewProps) {
  const { settings } = useAppContext()
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const { weekDates } = useWeekDates(weekOffset)

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-background-light dark:bg-background-dark">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 px-4 flex-1 min-h-0 pb-4 pt-4">
        {DAY_KEYS.map((day, index) => (
          <DayCard
            key={day}
            day={day}
            meal={weeklyPlan[day]}
            isFree={weeklyPlan[`${day}_free`]}
            dateStr={formatDateShort(weekDates[index])}
            dayName={DAY_NAMES[index]}
            people={settings.people}
            onDayClick={onDayClick}
            onRemoveMeal={onRemoveMeal}
            onToggleVacation={onToggleVacation}
            onMealClick={setSelectedMeal}
          />
        ))}
      </div>

      <MealModal meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
    </div>
  )
}
