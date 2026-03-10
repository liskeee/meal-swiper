import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CategoryFilter from '@/components/swipe/CategoryFilter'

const defaultProps = {
  activeCategories: [],
  activeCuisines: [],
  onToggleCategory: vi.fn(),
  onToggleCuisine: vi.fn(),
}

describe('CategoryFilter', () => {
  it('renders category buttons', () => {
    render(<CategoryFilter {...defaultProps} />)
    expect(screen.getByText('🍝 Makarony')).toBeInTheDocument()
    expect(screen.getByText('🍚 Ryż i kasze')).toBeInTheDocument()
  })

  it('renders cuisine buttons', () => {
    render(<CategoryFilter {...defaultProps} />)
    expect(screen.getByText('🇵🇱 Polska')).toBeInTheDocument()
    expect(screen.getByText('🇮🇹 Włoska')).toBeInTheDocument()
  })

  it('calls onToggleCategory when category clicked', () => {
    const onToggleCategory = vi.fn()
    render(<CategoryFilter {...defaultProps} onToggleCategory={onToggleCategory} />)
    fireEvent.click(screen.getByText('🍝 Makarony'))
    expect(onToggleCategory).toHaveBeenCalledWith('makarony')
  })

  it('calls onToggleCuisine when cuisine clicked', () => {
    const onToggleCuisine = vi.fn()
    render(<CategoryFilter {...defaultProps} onToggleCuisine={onToggleCuisine} />)
    fireEvent.click(screen.getByText('🇵🇱 Polska'))
    expect(onToggleCuisine).toHaveBeenCalledWith('polska')
  })

  it('shows active category with primary bg class', () => {
    render(<CategoryFilter {...defaultProps} activeCategories={['makarony']} />)
    const btn = screen.getByText('🍝 Makarony')
    expect(btn.classList.contains('bg-primary')).toBe(true)
  })

  it('shows active cuisine with primary bg class', () => {
    render(<CategoryFilter {...defaultProps} activeCuisines={['polska']} />)
    const btn = screen.getByText('🇵🇱 Polska')
    expect(btn.classList.contains('bg-primary')).toBe(true)
  })

  it('inactive category does not have bg-primary class', () => {
    render(<CategoryFilter {...defaultProps} activeCategories={[]} />)
    const btn = screen.getByText('🍝 Makarony')
    expect(btn.classList.contains('bg-primary')).toBe(false)
  })

  it('renders all 8 categories', () => {
    render(<CategoryFilter {...defaultProps} />)
    const categories = [
      '🍝 Makarony',
      '🍚 Ryż i kasze',
      '🥘 Jednogarnkowe',
      '🌯 Tortille i wrapi',
      '🫕 Zapiekanki',
      '🥗 Sałatki i bowle',
      '🥔 Ziemniaki',
      '🥞 Placki i naleśniki',
    ]
    categories.forEach((cat) => expect(screen.getByText(cat)).toBeInTheDocument())
  })

  it('renders all 7 cuisines', () => {
    render(<CategoryFilter {...defaultProps} />)
    const cuisines = [
      '🇵🇱 Polska',
      '🇮🇹 Włoska',
      '🥢 Azjatycka',
      '🌮 Meksykańska',
      '🫙 Indyjska',
      '🫒 Śródziemnomorska',
      '🌶️ Koreańska',
    ]
    cuisines.forEach((c) => expect(screen.getByText(c)).toBeInTheDocument())
  })
})
