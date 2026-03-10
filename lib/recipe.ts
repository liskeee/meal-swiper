import type { Meal, Ingredient } from '@/types'

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function enrichStepsWithAmounts(steps: string[], ingredients: Ingredient[]): string[] {
  return steps.map((step) => {
    let enrichedStep = step
    for (const ing of ingredients) {
      if (!ing.amount) continue
      const ingName = ing.name.split('(')[0].trim()
      const shortName = ingName.toLowerCase()
      const stepLower = enrichedStep.toLowerCase()

      if (stepLower.includes(shortName)) {
        const nameIdx = stepLower.indexOf(shortName)
        const afterName = enrichedStep.substring(
          nameIdx + shortName.length,
          nameIdx + shortName.length + 15
        )
        const hasAmountAlready = /\d+\s*(g|kg|ml|l|szt|łyżk)/i.test(afterName)

        if (!hasAmountAlready) {
          const regex = new RegExp(`(${escapeRegex(ingName)})`, 'i')
          enrichedStep = enrichedStep.replace(regex, `$1 (${ing.amount})`)
        }
      }
    }
    return enrichedStep
  })
}

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
