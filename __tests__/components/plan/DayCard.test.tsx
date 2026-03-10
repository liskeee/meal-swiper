import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DayCard from '@/components/plan/DayCard'
import type { Meal, DayKey } from '@/types'

const mockMeal: Meal = {
  id: '1',
  nazwa: 'Pasta Carbonara',
  opis: 'Pyszna pasta',
  photo_url: 'https://example.com/photo.jpg',
  prep_time: 30,
  kcal_baza: 450,
  kcal_z_miesem: 600,
  bialko_baza: 20,
  bialko_z_miesem: 35,
  trudnosc: 'łatwe',
  kuchnia: 'włoska',
  category: 'makarony',
  skladniki_baza: '[]',
  skladniki_mieso: '[]',
  przepis: '{}',
  tags: ['obiad'],
}

const defaultProps = {
  day: 'mon' as DayKey,
  meal: null,
  isFree: false,
  dateStr: '10 Mar',
  dayName: 'Poniedziałek',
  people: 2,
  onDayClick: vi.fn(),
  onRemoveMeal: vi.fn(),
  onToggleVacation: vi.fn(),
  onMealClick: vi.fn(),
}

describe('DayCard - empty state', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders day name and date', () => {
    render(<DayCard {...defaultProps} />)
    expect(screen.getByText(/Poniedziałek/)).toBeInTheDocument()
    expect(screen.getByText(/10 Mar/)).toBeInTheDocument()
  })

  it('shows "Brak planu" when no meal', () => {
    render(<DayCard {...defaultProps} />)
    expect(screen.getByText('Brak planu')).toBeInTheDocument()
  })

  it('calls onDayClick when empty card clicked', () => {
    render(<DayCard {...defaultProps} />)
    const card = screen.getByTestId('day-card-mon')
    fireEvent.click(card)
    expect(defaultProps.onDayClick).toHaveBeenCalledWith('mon')
  })

  it('shows menu when more_vert button clicked', () => {
    render(<DayCard {...defaultProps} />)
    const moreBtn = screen.getAllByText('more_vert')[0]
    fireEvent.click(moreBtn.closest('button')!)
    expect(screen.getByText('Dodaj danie')).toBeInTheDocument()
  })

  it('calls onToggleVacation from empty day menu', () => {
    render(<DayCard {...defaultProps} />)
    const moreBtn = screen.getAllByText('more_vert')[0]
    fireEvent.click(moreBtn.closest('button')!)
    const vacBtn = screen.getByText('Oznacz jako wolny')
    fireEvent.click(vacBtn)
    expect(defaultProps.onToggleVacation).toHaveBeenCalledWith('mon')
  })
})

describe('DayCard - with meal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders meal name', () => {
    render(<DayCard {...defaultProps} meal={mockMeal} />)
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
  })

  it('renders prep time', () => {
    render(<DayCard {...defaultProps} meal={mockMeal} />)
    expect(screen.getByText(/30 min/)).toBeInTheDocument()
  })

  it('calls onMealClick when meal button clicked', () => {
    render(<DayCard {...defaultProps} meal={mockMeal} />)
    const mealBtn = screen.getByText('Pasta Carbonara').closest('button')
    if (mealBtn) fireEvent.click(mealBtn)
    expect(defaultProps.onMealClick).toHaveBeenCalledWith(mockMeal)
  })

  it('shows menu with remove option when more_vert clicked', () => {
    render(<DayCard {...defaultProps} meal={mockMeal} />)
    const moreBtn = screen.getAllByText('more_vert')[0]
    fireEvent.click(moreBtn.closest('button')!)
    expect(screen.getByText('Usuń danie')).toBeInTheDocument()
  })

  it('calls onRemoveMeal from menu', () => {
    render(<DayCard {...defaultProps} meal={mockMeal} />)
    const moreBtn = screen.getAllByText('more_vert')[0]
    fireEvent.click(moreBtn.closest('button')!)
    fireEvent.click(screen.getByText('Usuń danie'))
    expect(defaultProps.onRemoveMeal).toHaveBeenCalledWith('mon')
  })

  it('calls onDayClick "Zmień danie" from menu', () => {
    render(<DayCard {...defaultProps} meal={mockMeal} />)
    const moreBtn = screen.getAllByText('more_vert')[0]
    fireEvent.click(moreBtn.closest('button')!)
    fireEvent.click(screen.getByText('Zmień danie'))
    expect(defaultProps.onDayClick).toHaveBeenCalledWith('mon')
  })
})

describe('DayCard - vacation state', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows "Urlop" when isFree is true', () => {
    render(<DayCard {...defaultProps} isFree={true} />)
    expect(screen.getByText('Urlop')).toBeInTheDocument()
  })

  it('shows vacation icon', () => {
    render(<DayCard {...defaultProps} isFree={true} />)
    expect(screen.getByText('flight_takeoff')).toBeInTheDocument()
  })

  it('shows menu when clicking more_vert on free day', () => {
    render(<DayCard {...defaultProps} isFree={true} />)
    const moreBtn = screen.getAllByText('more_vert')[0]
    fireEvent.click(moreBtn.closest('button')!)
    expect(screen.getByText(/Anuluj urlop/i)).toBeInTheDocument()
  })

  it('calls onToggleVacation via Anuluj urlop menu button', () => {
    render(<DayCard {...defaultProps} isFree={true} />)
    const moreBtn = screen.getAllByText('more_vert')[0]
    fireEvent.click(moreBtn.closest('button')!)
    fireEvent.click(screen.getByText(/Anuluj urlop/i))
    expect(defaultProps.onToggleVacation).toHaveBeenCalledWith('mon')
  })
})

describe('DayCard - context menu (right-click)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('handles context menu on empty day (confirm = true) → toggleVacation', () => {
    window.confirm = vi.fn(() => true)
    render(<DayCard {...defaultProps} />)
    const card = screen.getByTestId('day-card-mon')
    fireEvent.contextMenu(card)
    expect(defaultProps.onToggleVacation).toHaveBeenCalledWith('mon')
  })

  it('handles context menu on empty day (confirm = false) → no action', () => {
    window.confirm = vi.fn(() => false)
    render(<DayCard {...defaultProps} />)
    const card = screen.getByTestId('day-card-mon')
    fireEvent.contextMenu(card)
    expect(defaultProps.onToggleVacation).not.toHaveBeenCalled()
    expect(defaultProps.onRemoveMeal).not.toHaveBeenCalled()
  })

  it('handles context menu on meal day (confirm = true) → removeMeal', () => {
    window.confirm = vi.fn(() => true)
    render(<DayCard {...defaultProps} meal={mockMeal} />)
    const card = screen.getByTestId('day-card-mon')
    fireEvent.contextMenu(card)
    expect(defaultProps.onRemoveMeal).toHaveBeenCalledWith('mon')
  })

  it('handles context menu on meal day (confirm = false) → toggleVacation', () => {
    window.confirm = vi.fn(() => false)
    render(<DayCard {...defaultProps} meal={mockMeal} />)
    const card = screen.getByTestId('day-card-mon')
    fireEvent.contextMenu(card)
    expect(defaultProps.onToggleVacation).toHaveBeenCalledWith('mon')
  })

  it('handles context menu on vacation day (confirm = true) → toggleVacation off', () => {
    window.confirm = vi.fn(() => true)
    render(<DayCard {...defaultProps} isFree={true} />)
    const card = screen.getByTestId('day-card-mon')
    fireEvent.contextMenu(card)
    expect(defaultProps.onToggleVacation).toHaveBeenCalledWith('mon')
  })
})
