'use client'

import { useAppContext } from '@/lib/context'
import ShoppingListView from '@/components/ShoppingListView'

export default function ShoppingPage() {
  const { weeklyPlan, weekOffset, setWeekOffset } = useAppContext()

  return (
    <ShoppingListView
      weeklyPlan={weeklyPlan}
      weekOffset={weekOffset}
      onWeekChange={setWeekOffset}
    />
  )
}
