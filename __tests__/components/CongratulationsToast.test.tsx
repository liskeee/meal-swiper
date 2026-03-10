import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// Mock useAppContext
const mockUseAppContext = vi.fn()
vi.mock('@/lib/context', () => ({
  useAppContext: () => mockUseAppContext(),
}))

const { default: CongratulationsToast } = await import('@/components/CongratulationsToast')

describe('CongratulationsToast', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    mockUseAppContext.mockReturnValue({
      allDaysFilled: false,
      weekKey: '2024-01-01',
    })
  })

  it('renders nothing when allDaysFilled is false', () => {
    const { container } = render(<CongratulationsToast />)
    expect(container.firstChild).toBeNull()
  })

  it('shows toast when allDaysFilled becomes true', async () => {
    mockUseAppContext.mockReturnValue({
      allDaysFilled: true,
      weekKey: '2024-01-01',
    })

    render(<CongratulationsToast />)

    await waitFor(() => {
      expect(screen.getByText(/Tydzień zaplanowany/)).toBeInTheDocument()
    })
  })

  it('does not show toast again for same weekKey', async () => {
    sessionStorage.setItem('congratsShown:2024-01-01', '1')
    mockUseAppContext.mockReturnValue({
      allDaysFilled: true,
      weekKey: '2024-01-01',
    })

    const { container } = render(<CongratulationsToast />)

    await new Promise((r) => setTimeout(r, 50))
    expect(container.firstChild).toBeNull()
  })

  it('navigates to shopping when clicked', async () => {
    mockUseAppContext.mockReturnValue({
      allDaysFilled: true,
      weekKey: '2024-01-02',
    })

    render(<CongratulationsToast />)

    await waitFor(() => {
      expect(screen.getByText(/Tydzień zaplanowany/)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button'))
    expect(mockPush).toHaveBeenCalledWith('/shopping')
  })
})
