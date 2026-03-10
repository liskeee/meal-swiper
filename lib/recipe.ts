import type { Meal, Ingredient } from '@/types'

export interface ParsedRecipe {
  steps: string[]
  tips: string
  baseIngredients: Ingredient[]
  meatIngredients: Ingredient[]
}

export function parseRecipe(meal: Meal): ParsedRecipe {
  const recipe = (() => {
    try {
      return typeof meal.przepis === 'string' ? JSON.parse(meal.przepis) : meal.przepis
    } catch {
      return null
    }
  })()

  const baseIngredients: Ingredient[] = (() => {
    try {
      const raw =
        typeof meal.skladniki_baza === 'string'
          ? JSON.parse(meal.skladniki_baza)
          : meal.skladniki_baza
      return Array.isArray(raw) ? raw : []
    } catch {
      return []
    }
  })()

  const meatIngredients: Ingredient[] = (() => {
    try {
      const raw =
        typeof meal.skladniki_mieso === 'string'
          ? JSON.parse(meal.skladniki_mieso)
          : meal.skladniki_mieso
      return Array.isArray(raw) ? raw : []
    } catch {
      return []
    }
  })()

  return {
    steps: recipe?.kroki ?? [],
    tips: recipe?.wskazowki ?? '',
    baseIngredients,
    meatIngredients,
  }
}
