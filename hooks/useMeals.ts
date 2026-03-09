'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Meal } from '@/types'

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMeals = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/meals')
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      const data = await response.json()
      setMeals(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching meals:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setMeals([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMeals()
  }, [fetchMeals])

  return { meals, loading, error, refetch: fetchMeals }
}
