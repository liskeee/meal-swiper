import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSwipeState } from '@/hooks/useSwipeState'
import type { Meal } from '@/types'

const makeMeal = (id: string): Meal => ({
  id,
  nazwa: `Meal ${id}`,
  opis: '',
  photo_url: '',
  prep_time: 20,
  kcal_baza: 400,
  kcal_z_miesem: 500,
  bialko_baza: 15,
  bialko_z_miesem: 25,
  trudnosc: 'łatwe',
  kuchnia: 'polska',
  category: 'makarony',
  skladniki_baza: '[]',
  skladniki_mieso: '[]',
  przepis: '{}',
  tags: [],
})

describe('useSwipeState', () => {
  it('initializes with empty state', () => {
    const { result } = renderHook(() => useSwipeState())
    expect(result.current.shuffledMeals).toHaveLength(0)
    expect(result.current.currentSwipeIndex).toBe(0)
    expect(result.current.seenIds).toHaveLength(0)
  })

  it('shuffleMeals sets meals and resets index', () => {
    const { result } = renderHook(() => useSwipeState())
    const meals = [makeMeal('1'), makeMeal('2'), makeMeal('3')]

    act(() => {
      result.current.shuffleMeals(meals)
    })

    expect(result.current.shuffledMeals).toHaveLength(3)
    expect(result.current.currentSwipeIndex).toBe(0)
    expect(result.current.seenIds).toHaveLength(0)
  })

  it('setCurrentSwipeIndex updates index', () => {
    const { result } = renderHook(() => useSwipeState())

    act(() => {
      result.current.setCurrentSwipeIndex(3)
    })

    expect(result.current.currentSwipeIndex).toBe(3)
  })

  it('setSeenIds updates seen ids', () => {
    const { result } = renderHook(() => useSwipeState())

    act(() => {
      result.current.setSeenIds(['1', '2'])
    })

    expect(result.current.seenIds).toEqual(['1', '2'])
  })

  it('setShuffledMeals updates meals', () => {
    const { result } = renderHook(() => useSwipeState())
    const meals = [makeMeal('a'), makeMeal('b')]

    act(() => {
      result.current.setShuffledMeals(meals)
    })

    expect(result.current.shuffledMeals).toHaveLength(2)
  })

  it('advanceIndex increments currentSwipeIndex', () => {
    const { result } = renderHook(() => useSwipeState())

    act(() => {
      result.current.advanceIndex()
    })

    expect(result.current.currentSwipeIndex).toBe(1)

    act(() => {
      result.current.advanceIndex()
    })

    expect(result.current.currentSwipeIndex).toBe(2)
  })

  it('resetSwipe resets index and seenIds', () => {
    const { result } = renderHook(() => useSwipeState())

    act(() => {
      result.current.setCurrentSwipeIndex(5)
      result.current.setSeenIds(['1', '2', '3'])
    })

    act(() => {
      result.current.resetSwipe()
    })

    expect(result.current.currentSwipeIndex).toBe(0)
    expect(result.current.seenIds).toHaveLength(0)
  })
})
