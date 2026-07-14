import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DollarSign } from 'lucide-react'
import { TileCard } from '@/components/common/TileCard'
import { DashboardCardsProvider } from '@/context/DashboardCardsContext'

// Wrap with provider since TileCard uses CardMenu which uses DashboardCardsContext
function Wrapper({ children }: { children: React.ReactNode }) {
  return <DashboardCardsProvider>{children}</DashboardCardsProvider>
}

describe('TileCard', () => {
  it('renders title and value', () => {
    render(<Wrapper><TileCard title="Total Revenue" value="Rp. 12,1 M" icon={DollarSign} /></Wrapper>)
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('Rp. 12,1 M')).toBeInTheDocument()
  })

  it('renders unit when provided', () => {
    render(<Wrapper><TileCard title="Items" value="120" unit="unit" icon={DollarSign} /></Wrapper>)
    expect(screen.getByText('unit')).toBeInTheDocument()
  })

  it('renders remarks when provided', () => {
    render(<Wrapper><TileCard title="KPI" value="98%" remarks="vs last month" icon={DollarSign} /></Wrapper>)
    expect(screen.getByText('vs last month')).toBeInTheDocument()
  })

  it('calls onClick when card is clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<Wrapper><TileCard title="Click me" value="0" icon={DollarSign} onClick={onClick} /></Wrapper>)
    await user.click(screen.getByText('Click me'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard Enter on clickable card', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<Wrapper><TileCard title="Key Card" value="0" icon={DollarSign} onClick={onClick} /></Wrapper>)
    const card = screen.getByRole('button')
    await user.type(card, '{Enter}')
    expect(onClick).toHaveBeenCalled()
  })

  it('handles keyboard Space on clickable card', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<Wrapper><TileCard title="Space Card" value="0" icon={DollarSign} onClick={onClick} /></Wrapper>)
    const card = screen.getByRole('button')
    await user.type(card, ' ')
    expect(onClick).toHaveBeenCalled()
  })

  it('renders CardMenu when cardId and module are provided', () => {
    render(
      <Wrapper>
        <TileCard title="Menu Card" value="0" icon={DollarSign} cardId="tile-1" module="accounting" />
      </Wrapper>
    )
    expect(screen.getByLabelText('Card menu')).toBeInTheDocument()
  })

  it('renders customMenu when provided', () => {
    render(
      <Wrapper>
        <TileCard title="Custom" value="0" icon={DollarSign} customMenu={<button>Custom Action</button>} />
      </Wrapper>
    )
    expect(screen.getByText('Custom Action')).toBeInTheDocument()
  })

  it('does not render as button when onClick is not provided', () => {
    render(<Wrapper><TileCard title="Static" value="0" icon={DollarSign} /></Wrapper>)
    expect(screen.queryByRole('button', { name: /static/i })).toBeNull()
  })

  it('applies custom icon colors', () => {
    const { container } = render(
      <Wrapper>
        <TileCard title="Colored" value="0" icon={DollarSign} iconBgColor="bg-blue-100" iconColor="text-blue-600" />
      </Wrapper>
    )
    expect(container.querySelector('.bg-blue-100')).toBeInTheDocument()
  })
})
