import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CardMenu } from '@/components/common/CardMenu'
import { DashboardCardsProvider, useDashboardCards } from '@/context/DashboardCardsContext'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <DashboardCardsProvider>{children}</DashboardCardsProvider>
}

const defaultProps = {
  cardId: 'test-card-1',
  cardType: 'tile' as const,
  cardData: { title: 'Revenue', value: '100M' },
}

describe('CardMenu', () => {
  it('renders the menu button', () => {
    render(<Wrapper><CardMenu {...defaultProps} /></Wrapper>)
    expect(screen.getByLabelText('Card menu')).toBeInTheDocument()
  })

  it('menu is closed by default', () => {
    render(<Wrapper><CardMenu {...defaultProps} /></Wrapper>)
    expect(screen.queryByText(/tambahkan ke/i)).toBeNull()
  })

  it('opens menu when button is clicked', async () => {
    const user = userEvent.setup()
    render(<Wrapper><CardMenu {...defaultProps} /></Wrapper>)
    await user.click(screen.getByLabelText('Card menu'))
    expect(screen.getByText(/copy to central dashboard/i)).toBeInTheDocument()
  })

  it('closes menu when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <Wrapper>
        <div>
          <CardMenu {...defaultProps} />
          <p>Outside element</p>
        </div>
      </Wrapper>
    )
    await user.click(screen.getByLabelText('Card menu'))
    expect(screen.getByText(/copy to central dashboard/i)).toBeInTheDocument()

    await user.click(screen.getByText('Outside element'))
    await waitFor(() => {
      expect(screen.queryByText(/copy to central dashboard/i)).toBeNull()
    })
  })

  it('shows "Copied!" feedback after adding card', async () => {
    const user = userEvent.setup()
    render(<Wrapper><CardMenu {...defaultProps} /></Wrapper>)
    await user.click(screen.getByLabelText('Card menu'))
    await user.click(screen.getByText(/copy to central dashboard/i))
    expect(screen.getByText('Copied!')).toBeInTheDocument()
  })

  it('adds card to DashboardCardsContext after clicking copy', async () => {
    const user = userEvent.setup()
    function HasCardChecker() {
      const { hasCard } = useDashboardCards()
      return <span data-testid="has-card">{String(hasCard(defaultProps.cardId))}</span>
    }
    render(
      <Wrapper>
        <CardMenu {...defaultProps} />
        <HasCardChecker />
      </Wrapper>
    )
    expect(screen.getByTestId('has-card').textContent).toBe('false')
    await user.click(screen.getByLabelText('Card menu'))
    await user.click(screen.getByText(/copy to central dashboard/i))
    expect(screen.getByTestId('has-card').textContent).toBe('true')
  })
})
