import { describe, it, expect } from 'vitest'
import {
  getWeekDates,
  formatWeekRange,
  formatWeekRangeShort,
  formatDateShort,
  DAY_NAMES_MAP,
} from '@/lib/utils'

describe('formatWeekRange - cross-month', () => {
  it('handles same-month range', () => {
    // Create dates in same month
    const dates = [
      new Date(2024, 2, 4), // Mar 4
      new Date(2024, 2, 5),
      new Date(2024, 2, 6),
      new Date(2024, 2, 7),
      new Date(2024, 2, 8), // Mar 8
    ]
    const range = formatWeekRange(dates)
    expect(range).toBe('4 - 8 Mar')
  })

  it('handles cross-month range', () => {
    const dates = [
      new Date(2024, 2, 25), // Mar 25
      new Date(2024, 2, 26),
      new Date(2024, 2, 27),
      new Date(2024, 2, 28),
      new Date(2024, 3, 1), // Apr 1
    ]
    const range = formatWeekRange(dates)
    expect(range).toBe('25 Mar - 1 Kwi')
  })
})

describe('formatWeekRangeShort', () => {
  it('handles same-month short range', () => {
    const dates = [
      new Date(2024, 2, 4),
      new Date(2024, 2, 5),
      new Date(2024, 2, 6),
      new Date(2024, 2, 7),
      new Date(2024, 2, 8),
    ]
    const range = formatWeekRangeShort(dates)
    expect(range).toBe('4-8.03')
  })

  it('handles cross-month short range', () => {
    const dates = [
      new Date(2024, 2, 25),
      new Date(2024, 2, 26),
      new Date(2024, 2, 27),
      new Date(2024, 2, 28),
      new Date(2024, 3, 1),
    ]
    const range = formatWeekRangeShort(dates)
    expect(range).toBe('25.03-1.04')
  })
})

describe('formatDateShort - all months', () => {
  const monthNames = [
    'Sty',
    'Lut',
    'Mar',
    'Kwi',
    'Maj',
    'Cze',
    'Lip',
    'Sie',
    'Wrz',
    'Paź',
    'Lis',
    'Gru',
  ]

  monthNames.forEach((name, idx) => {
    it(`formats month ${idx + 1} as ${name}`, () => {
      const date = new Date(2024, idx, 15)
      expect(formatDateShort(date)).toBe(`15 ${name}`)
    })
  })
})

describe('DAY_NAMES_MAP', () => {
  it('has all 5 days', () => {
    expect(Object.keys(DAY_NAMES_MAP)).toHaveLength(5)
  })

  it('maps mon to Poniedziałek', () => {
    expect(DAY_NAMES_MAP['mon']).toBe('Poniedziałek')
  })

  it('maps fri to Piątek', () => {
    expect(DAY_NAMES_MAP['fri']).toBe('Piątek')
  })
})
