import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AmountBadge from '@/components/ui/AmountBadge'

describe('AmountBadge', () => {
  it('renders the amount text', () => {
    render(<AmountBadge amount="300g" />)
    expect(screen.getByText('300g')).toBeInTheDocument()
  })

  it('applies default classes', () => {
    render(<AmountBadge amount="1 kg" />)
    const badge = screen.getByText('1 kg')
    expect(badge.classList.contains('bg-primary/15')).toBe(true)
    expect(badge.classList.contains('text-primary')).toBe(true)
  })

  it('applies additional className', () => {
    render(<AmountBadge amount="2 szt" className="custom-class" />)
    const badge = screen.getByText('2 szt')
    expect(badge.classList.contains('custom-class')).toBe(true)
  })

  it('renders as span element', () => {
    render(<AmountBadge amount="50ml" />)
    const badge = screen.getByText('50ml')
    expect(badge.tagName.toLowerCase()).toBe('span')
  })
})
