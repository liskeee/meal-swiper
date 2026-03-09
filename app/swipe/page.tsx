'use client'

import { useRouter } from 'next/navigation'
import { useAppContext } from '@/lib/context'
import SwipeView from '@/components/SwipeView'

export default function SwipePage() {
  const router = useRouter()
  const {
    meals,
    weeklyPlan,
    currentSwipeDay,
    setCurrentSwipeDay,
    handleSwipeRight,
  } = useAppContext()

  const handleComplete = () => {
    setCurrentSwipeDay(null)
    router.push('/plan')
  }

  return (
    <SwipeView
      meals={meals}
      onSwipeRight={(meal) => {
        handleSwipeRight(meal)
      }}
      currentDay={currentSwipeDay}
      onComplete={handleComplete}
      weeklyPlan={weeklyPlan}
      onSkipAll={handleComplete}
    />
  )
}
