import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { DashboardCardsProvider, useDashboardCards, type DashboardCard } from '@/context/DashboardCardsContext'

function Wrapper({ children }: { children: ReactNode }) {
  return <DashboardCardsProvider>{children}</DashboardCardsProvider>
}

// Consumer component to expose context values
function TestConsumer() {
  const { cards, addCard, removeCard, hasCard } = useDashboardCards()
  return (
    <div>
      <span data-testid="card-count">{cards.length}</span>
      <span data-testid="has-card-1">{String(hasCard('card-1'))}</span>
      <button onClick={() => addCard({ id: 'card-1', type: 'tile', data: {}, module: 'accounting' })}>
        Add Card 1
      </button>
      <button onClick={() => addCard({ id: 'card-1', type: 'tile', data: {}, module: 'accounting' })}>
        Add Duplicate
      </button>
      <button onClick={() => removeCard('card-1')}>Remove Card 1</button>
    </div>
  )
}

describe('DashboardCardsProvider', () => {
  it('starts with empty cards array', () => {
    render(<Wrapper><TestConsumer /></Wrapper>)
    expect(screen.getByTestId('card-count').textContent).toBe('0')
  })

  it('addCard adds a new card', async () => {
    const user = userEvent.setup()
    render(<Wrapper><TestConsumer /></Wrapper>)
    await user.click(screen.getByText('Add Card 1'))
    expect(screen.getByTestId('card-count').textContent).toBe('1')
  })

  it('addCard does NOT add duplicate cards', async () => {
    const user = userEvent.setup()
    render(<Wrapper><TestConsumer /></Wrapper>)
    await user.click(screen.getByText('Add Card 1'))
    await user.click(screen.getByText('Add Duplicate'))
    expect(screen.getByTestId('card-count').textContent).toBe('1')
  })

  it('hasCard returns true after adding', async () => {
    const user = userEvent.setup()
    render(<Wrapper><TestConsumer /></Wrapper>)
    expect(screen.getByTestId('has-card-1').textContent).toBe('false')
    await user.click(screen.getByText('Add Card 1'))
    expect(screen.getByTestId('has-card-1').textContent).toBe('true')
  })

  it('removeCard removes the card', async () => {
    const user = userEvent.setup()
    render(<Wrapper><TestConsumer /></Wrapper>)
    await user.click(screen.getByText('Add Card 1'))
    await user.click(screen.getByText('Remove Card 1'))
    expect(screen.getByTestId('card-count').textContent).toBe('0')
  })

  it('useDashboardCards throws when used outside provider', () => {
    const BadConsumer = () => { useDashboardCards(); return null }
    expect(() => render(<BadConsumer />)).toThrow('useDashboardCards must be used within DashboardCardsProvider')
  })
})
