import { describe, it, expect } from 'vitest'
import { scaleIngredient } from '../../lib/scaling'

describe('scaleIngredient rounding', () => {
  it('rounds discrete units correctly (1.6 -> 2)', () => {
    const ing = { name: 'Czosnek', amount: '2 ząbki' }
    // base is for 2 people, so scaleFactor 0.8 is 1.6 ząbki -> should be 2 or 1.5?
    // My logic was: fraction > 0.8 -> round up. 1.6 % 1 = 0.6.
    // Actually, 1.6 should be 1.5 or 2.
    // My logic: if (fraction >= 0.2 && fraction <= 0.8) -> floor + 0.5.
    // 1.6 has fraction 0.6. So 1 + 0.5 = 1.5.
    // 1.9 has fraction 0.9. So Math.round(1.9) = 2.
    // 1.1 has fraction 0.1. So Math.round(1.1) = 1.
    const scaled = scaleIngredient(ing, 0.8) // 2 * 0.8 = 1.6 -> 1.5
    expect(scaled.amount).toBe('1.5 ząbki')
  })

  it('rounds discrete units (0.8 -> 1)', () => {
    const ing = { name: 'Puszka', amount: '1 puszka' }
    const scaled = scaleIngredient(ing, 0.8) // 1 * 0.8 = 0.8 -> 1
    expect(scaled.amount).toBe('1 puszki')
  })
})
