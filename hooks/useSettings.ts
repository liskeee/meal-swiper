'use client'

import { useState, useEffect, useMemo } from 'react'
import type { AppSettings } from '@/types'

const STORAGE_KEY = 'meal_swiper_settings'

export const DEFAULT_SETTINGS: AppSettings = {
  people: 2,
  persons: [
    { kcal: 2000, protein: 120 },
    { kcal: 1800, protein: 100 },
  ],
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Wczytaj ustawienia z localStorage przy montowaniu
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AppSettings
        setSettings(parsed)
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Zapisz ustawienia do localStorage
  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error)
    }
  }

  // Oblicz całkowitą liczbę kalorii
  const totalKcal = useMemo(() => {
    return settings.persons.slice(0, settings.people).reduce((sum, person) => sum + person.kcal, 0)
  }, [settings])

  // Oblicz całkowitą ilość białka
  const totalProtein = useMemo(() => {
    return settings.persons
      .slice(0, settings.people)
      .reduce((sum, person) => sum + person.protein, 0)
  }, [settings])

  return {
    settings,
    updateSettings,
    totalKcal,
    totalProtein,
    isLoaded,
  }
}
