import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CentralDashboardCardMenu } from '@/components/common/CentralDashboardCardMenu'
import { DashboardCardsProvider } from '@/context/DashboardCardsContext'

function Provider({ children }: { children: React.ReactNode }) {
  return <DashboardCardsProvider>{children}</DashboardCardsProvider>
}

describe('CentralDashboardCardMenu', () => {
  it('renders menu button', () => {
    render(<Provider><CentralDashboardCardMenu cardId="card-central-1" /></Provider>)
    expect(screen.getByLabelText('Card menu')).toBeInTheDocument()
  })

  it('opens menu on click', async () => {
    const user = userEvent.setup()
    render(<Provider><CentralDashboardCardMenu cardId="card-central-1" /></Provider>)
    await user.click(screen.getByLabelText('Card menu'))
    expect(screen.getByText(/delete from central/i)).toBeInTheDocument()
  })

  it('closes menu when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <Provider>
        <CentralDashboardCardMenu cardId="card-central-1" />
        <p data-testid="outside">Outside</p>
      </Provider>
    )
    await user.click(screen.getByLabelText('Card menu'))
    expect(screen.getByText(/delete from central/i)).toBeInTheDocument()
    await user.click(screen.getByTestId('outside'))
    await waitFor(() => expect(screen.queryByText(/delete from central/i)).toBeNull())
  })
})
