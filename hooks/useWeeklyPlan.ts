'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Meal, DayKey, WeeklyPlan } from '@/types'
import { getWeeklyPlan, saveWeeklyPlan, createDefaultPlan } from '@/lib/storage'
import { getWeekKey } from '@/lib/utils'

export function useWeeklyPlan() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(createDefaultPlan)

  const currentWeekKey = getWeekKey(weekOffset)

  useEffect(() => {
    setWeeklyPlan(getWeeklyPlan(currentWeekKey))
  }, [currentWeekKey])

  const updatePlan = useCallback(
    (newPlan: WeeklyPlan) => {
      setWeeklyPlan(newPlan)
      saveWeeklyPlan(currentWeekKey, newPlan)
    },
    [currentWeekKey]
  )

  const setMeal = useCallback(
    (day: DayKey, meal: Meal) => {
      const newPlan = { ...weeklyPlan, [day]: meal }
      updatePlan(newPlan)
    },
    [weeklyPlan, updatePlan]
  )

  const removeMeal = useCallback(
    (day: DayKey) => {
      const newPlan = { ...weeklyPlan, [day]: null }
      updatePlan(newPlan)
    },
    [weeklyPlan, updatePlan]
  )

  const toggleVacation = useCallback(
    (day: DayKey) => {
      const freeKey = `${day}_free` as `${DayKey}_free`
      const newPlan = { ...weeklyPlan, [freeKey]: !weeklyPlan[freeKey] }
      if (newPlan[freeKey]) newPlan[day] = null
      updatePlan(newPlan)
    },
    [weeklyPlan, updatePlan]
  )

  return {
    weeklyPlan,
    weekOffset,
    setWeekOffset,
    setMeal,
    removeMeal,
    toggleVacation,
    getWeekKey: () => currentWeekKey,
  }
}
