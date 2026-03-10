import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders loading text', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Ładowanie...')).toBeInTheDocument()
  })

  it('renders the restaurant icon', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('restaurant')).toBeInTheDocument()
  })

  it('has animate-spin class on icon', () => {
    render(<LoadingSpinner />)
    const icon = screen.getByText('restaurant')
    expect(icon.classList.contains('animate-spin')).toBe(true)
  })
})
