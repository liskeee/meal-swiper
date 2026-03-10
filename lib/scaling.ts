import type { Ingredient } from '@/types'

export function parseAmount(amount: string): { value: number; unit: string } | null {
  if (!amount) return null

  // obsłuż ułamki: "1/2", "3/4" etc
  const fractionMatch = amount.match(/^(\d+)\/(\d+)\s*(.*)$/)
  if (fractionMatch) {
    const value = parseInt(fractionMatch[1]) / parseInt(fractionMatch[2])
    return { value, unit: fractionMatch[3].trim() }
  }

  const match = amount.match(/^(\d+(?:[,.]\d+)?)\s*(.*)$/)
  if (!match) return null
  const value = parseFloat(match[1].replace(',', '.'))
  if (isNaN(value)) return null
  return { value, unit: match[2].trim() }
}

export function scaleIngredient(ing: Ingredient, people: number, basePeople = 2): Ingredient {
  if (people === basePeople) return ing
  const parsed = parseAmount(ing.amount)
  if (!parsed) return ing

  const scaled = parsed.value * (people / basePeople)

  // zaokrąglenie: dla g/ml do 5, dla reszty 1 miejsce po przecinku jeśli <10
  let rounded: number
  const unit = parsed.unit.toLowerCase()
  if (unit === 'g' || unit === 'ml') {
    rounded = Math.round(scaled / 5) * 5
  } else if (scaled < 10) {
    rounded = Math.round(scaled * 10) / 10
  } else {
    rounded = Math.round(scaled)
  }

  return {
    ...ing,
    amount: `${rounded}${parsed.unit ? ' ' + parsed.unit : ''}`.trim(),
  }
}
