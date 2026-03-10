import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CookingProgressBar from '@/components/cooking/CookingProgressBar'

describe('CookingProgressBar', () => {
  it('renders "Postęp gotowania" label', () => {
    render(<CookingProgressBar total={5} done={2} />)
    expect(screen.getByText('Postęp gotowania')).toBeInTheDocument()
  })

  it('shows correct percent (0%)', () => {
    render(<CookingProgressBar total={5} done={0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('shows correct percent (40%)', () => {
    render(<CookingProgressBar total={5} done={2} />)
    expect(screen.getByText('40%')).toBeInTheDocument()
  })

  it('shows 100% when all done', () => {
    render(<CookingProgressBar total={4} done={4} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('shows completion message when 100%', () => {
    render(<CookingProgressBar total={3} done={3} />)
    expect(screen.getByText(/Danie gotowe/)).toBeInTheDocument()
  })

  it('does not show completion message when not done', () => {
    render(<CookingProgressBar total={3} done={2} />)
    expect(screen.queryByText(/Danie gotowe/)).toBeNull()
  })

  it('handles total=0 gracefully (0%)', () => {
    render(<CookingProgressBar total={0} done={0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('progress bar has correct width style', () => {
    const { container } = render(<CookingProgressBar total={4} done={2} />)
    const bar = container.querySelector<HTMLElement>('[style]')
    expect(bar?.style.width).toBe('50%')
  })
})
