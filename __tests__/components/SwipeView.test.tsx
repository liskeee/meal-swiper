import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import SwipeView from '@/components/SwipeView'
import type { Meal, WeeklyPlan } from '@/types'

// Mock useSwipe hook
vi.mock('@/hooks/useSwipe', () => ({
  useSwipe: () => ({
    dragOffset: { x: 0, y: 0 },
    isDragging: false,
    rotation: 0,
    opacity: 0,
    handlers: {
      onMouseDown: vi.fn(),
      onMouseMove: vi.fn(),
      onMouseUp: vi.fn(() => null),
      onMouseLeave: vi.fn(() => null),
      onTouchStart: vi.fn(),
      onTouchMove: vi.fn(),
      onTouchEnd: vi.fn(() => null),
    },
    animateOut: vi.fn(),
    reset: vi.fn(),
  }),
}))

const mockMeal: Meal = {
  id: '1',
  nazwa: 'Pasta Carbonara',
  opis: 'Pyszna pasta z boczkiem',
  photo_url: 'https://i.imgur.com/abc123.jpg',
  prep_time: 30,
  kcal_baza: 450,
  kcal_z_miesem: 600,
  bialko_baza: 15,
  bialko_z_miesem: 30,
  trudnosc: 'łatwe',
  kuchnia: 'włoska',
  skladniki_baza: '[]',
  skladniki_mieso: '[]',
  przepis: '{}',
  tags: ['obiad'],
}

const mockMeal2: Meal = {
  ...mockMeal,
  id: '2',
  nazwa: 'Pizza Margherita',
  photo_url: 'https://i.imgur.com/def456.jpg',
}

const defaultPlan: WeeklyPlan = {
  mon: null, tue: null, wed: null, thu: null, fri: null,
  mon_free: false, tue_free: false, wed_free: false, thu_free: false, fri_free: false,
}

const defaultProps = {
  meals: [mockMeal, mockMeal2],
  onSwipeRight: vi.fn(),
  currentDay: 'mon' as const,
  onComplete: vi.fn(),
  weeklyPlan: defaultPlan,
  onSkipAll: vi.fn(),
}

describe('SwipeView', () => {
  it('renders card with a meal name (shuffled)', () => {
    render(<SwipeView {...defaultProps} />)
    // After shuffle, either meal could be first
    const hasMeal = screen.queryByText('Pasta Carbonara') || screen.queryByText('Pizza Margherita')
    expect(hasMeal).toBeInTheDocument()
  })

  it('renders image with non-empty src', () => {
    render(<SwipeView {...defaultProps} />)
    const imgs = screen.getAllByRole('img')
    expect(imgs[0]).toHaveAttribute('src')
    expect((imgs[0] as HTMLImageElement).src).not.toBe('')
  })

  it('clicking heart button triggers swipe right flow', () => {
    vi.useFakeTimers()
    render(<SwipeView {...defaultProps} />)

    const buttons = screen.getAllByRole('button')
    const heartButton = buttons.find(btn =>
      btn.querySelector('.material-symbols-outlined')?.textContent === 'favorite'
    )
    expect(heartButton).toBeTruthy()
    fireEvent.click(heartButton!)

    vi.advanceTimersByTime(300)
    // Should be called with whichever meal is first after shuffle
    expect(defaultProps.onSwipeRight).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('clicking close button moves to next card', async () => {
    vi.useFakeTimers()
    render(<SwipeView {...defaultProps} />)

    // Get the currently displayed meal name
    const firstMeal = screen.queryByText('Pasta Carbonara')
      ? 'Pasta Carbonara' : 'Pizza Margherita'
    const secondMeal = firstMeal === 'Pasta Carbonara'
      ? 'Pizza Margherita' : 'Pasta Carbonara'

    const buttons = screen.getAllByRole('button')
    const closeButton = buttons.find(btn =>
      btn.querySelector('.material-symbols-outlined')?.textContent === 'close'
    )
    expect(closeButton).toBeTruthy()

    await act(async () => {
      fireEvent.click(closeButton!)
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByText(secondMeal)).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('renders "Brak więcej posiłków" when no meals', () => {
    render(<SwipeView {...defaultProps} meals={[]} />)
    expect(screen.getByText('Brak więcej posiłków')).toBeInTheDocument()
  })

  it('shows toast with meal name on swipe right', () => {
    render(<SwipeView {...defaultProps} />)

    const buttons = screen.getAllByRole('button')
    const heartButton = buttons.find(btn =>
      btn.querySelector('.material-symbols-outlined')?.textContent === 'favorite'
    )
    fireEvent.click(heartButton!)

    expect(screen.getByText(/Dodano:/)).toBeInTheDocument()
  })
})
