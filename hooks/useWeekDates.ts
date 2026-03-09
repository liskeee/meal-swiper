'use client'

import { useMemo } from 'react'
import { getWeekDates, formatWeekRange } from '@/lib/utils'

export function useWeekDates(weekOffset: number) {
  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset])
  const weekRange = useMemo(() => formatWeekRange(weekDates), [weekDates])

  return { weekDates, formatWeekRange: () => weekRange }
}
