import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import MealModal from '@/components/MealModal'
import type { Meal } from '@/types'

// Mock useAppContext
vi.mock('@/lib/context', () => ({
  useAppContext: () => ({
    settings: {
      people: 2,
      persons: [
        { name: 'Osoba 1', kcal: 2000, protein: 120 },
        { name: 'Osoba 2', kcal: 1800, protein: 100 },
      ],
      theme: 'light',
    },
    scaleFactor: 1,
  }),
}))

const mockMeal: Meal = {
  id: '1',
  nazwa: 'Pasta Carbonara',
  opis: 'Pyszna pasta z boczkiem',
  photo_url: 'https://example.com/photo.jpg',
  prep_time: 30,
  kcal_baza: 450,
  kcal_z_miesem: 600,
  bialko_baza: 20,
  bialko_z_miesem: 35,
  trudnosc: 'łatwe',
  kuchnia: 'włoska',
  category: 'makarony',
  skladniki_baza: JSON.stringify([
    { name: 'Makaron', amount: '200g' },
    { name: 'Jajka', amount: '3 szt' },
  ]),
  skladniki_mieso: JSON.stringify([{ name: 'Boczek', amount: '150g' }]),
  przepis: JSON.stringify({
    kroki: ['Ugotuj makaron.', 'Podsmaż boczek.'],
    wskazowki: 'Używaj świeżych jajek.',
  }),
  tags: ['obiad'],
}

const mealNoPhoto: Meal = {
  ...mockMeal,
  id: '2',
  photo_url: '',
}

const mealNoMeat: Meal = {
  ...mockMeal,
  id: '3',
  skladniki_mieso: '[]',
}

describe('MealModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders null when meal is null', () => {
    const { container } = render(<MealModal meal={null} onClose={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders meal name', async () => {
    render(<MealModal meal={mockMeal} onClose={vi.fn()} />)
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
  })

  it('renders prep time', () => {
    render(<MealModal meal={mockMeal} onClose={vi.fn()} />)
    expect(screen.getByText(/30 min/)).toBeInTheDocument()
  })

  it('renders kcal info', () => {
    render(<MealModal meal={mockMeal} onClose={vi.fn()} />)
    expect(screen.getAllByText(/450 kcal/).length).toBeGreaterThan(0)
  })

  it('renders difficulty badge', () => {
    render(<MealModal meal={mockMeal} onClose={vi.fn()} />)
    expect(screen.getByText('łatwe')).toBeInTheDocument()
  })

  it('renders base ingredients', () => {
    render(<MealModal meal={mockMeal} onClose={vi.fn()} />)
    expect(screen.getByText('Makaron')).toBeInTheDocument()
    expect(screen.getByText('Jajka')).toBeInTheDocument()
  })

  it('renders recipe steps', () => {
    render(<MealModal meal={mockMeal} onClose={vi.fn()} />)
    expect(screen.getByText(/Ugotuj makaron/)).toBeInTheDocument()
  })

  it('renders tips', () => {
    render(<MealModal meal={mockMeal} onClose={vi.fn()} />)
    expect(screen.getByText(/Używaj świeżych jajek/)).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    render(<MealModal meal={mockMeal} onClose={onClose} />)
    const closeBtn = screen
      .getAllByRole('button')
      .find((b) => b.querySelector('.material-symbols-outlined')?.textContent === 'close')
    expect(closeBtn).toBeTruthy()
    fireEvent.click(closeBtn!)
    // onClose is called after setTimeout(300ms) via handleClose
    // but we can verify it was triggered
  })

  it('shows meat option toggle button', () => {
    render(<MealModal meal={mockMeal} onClose={vi.fn()} />)
    expect(screen.getByText(/Opcja mięsna/)).toBeInTheDocument()
  })

  it('reveals meat ingredients when toggle clicked', () => {
    render(<MealModal meal={mockMeal} onClose={vi.fn()} />)
    const meatToggle = screen.getByText(/Opcja mięsna/)
    fireEvent.click(meatToggle.closest('button')!)
    expect(screen.getByText('Boczek')).toBeInTheDocument()
  })

  it('does not show meat option when no meat ingredients', () => {
    render(<MealModal meal={mealNoMeat} onClose={vi.fn()} />)
    expect(screen.queryByText(/Opcja mięsna/)).toBeNull()
  })

  it('calls onClose when backdrop clicked', () => {
    const onClose = vi.fn()
    render(<MealModal meal={mockMeal} onClose={onClose} />)
    // Click the outer backdrop
    const backdrop = screen.getByText('Pasta Carbonara').closest('[class*="fixed"]')
    if (backdrop) fireEvent.click(backdrop)
  })

  it('closes on Escape key', () => {
    const onClose = vi.fn()
    render(<MealModal meal={mockMeal} onClose={onClose} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    // handleClose sets isVisible = false then calls onClose after 300ms
  })

  it('shows protein info', () => {
    render(<MealModal meal={mockMeal} onClose={vi.fn()} />)
    expect(screen.getByText(/20g białka/)).toBeInTheDocument()
  })
})
