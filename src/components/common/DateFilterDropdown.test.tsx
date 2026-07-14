import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DateFilterDropdown } from '@/components/common/DateFilterDropdown'

describe('DateFilterDropdown', () => {
  it('renders the trigger button with current value label', () => {
    render(<DateFilterDropdown value="all" onChange={vi.fn()} />)
    expect(screen.getByText('All Time')).toBeInTheDocument()
  })

  it('renders This Month label for month value', () => {
    render(<DateFilterDropdown value="month" onChange={vi.fn()} />)
    expect(screen.getByText('This Month')).toBeInTheDocument()
  })

  it('renders This Year label for year value', () => {
    render(<DateFilterDropdown value="year" onChange={vi.fn()} />)
    expect(screen.getByText('This Year')).toBeInTheDocument()
  })

  it('dropdown is closed by default', () => {
    render(<DateFilterDropdown value="all" onChange={vi.fn()} />)
    expect(screen.queryByText('This Month')).toBeNull()
  })

  it('opens dropdown when button is clicked', async () => {
    const user = userEvent.setup()
    render(<DateFilterDropdown value="all" onChange={vi.fn()} />)
    await user.click(screen.getByText('All Time'))
    expect(screen.getAllByText('This Month').length).toBeGreaterThan(0)
    expect(screen.getAllByText('This Year').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Custom Range').length).toBeGreaterThan(0)
  })

  it('calls onChange with correct option on click', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<DateFilterDropdown value="all" onChange={onChange} />)
    await user.click(screen.getByText('All Time'))
    const buttons = screen.getAllByText('This Month')
    await user.click(buttons[buttons.length - 1])
    expect(onChange).toHaveBeenCalledWith('month')
  })

  it('closes dropdown after selecting a non-custom option', async () => {
    const user = userEvent.setup()
    render(<DateFilterDropdown value="all" onChange={vi.fn()} />)
    await user.click(screen.getByText('All Time'))
    const yearButtons = screen.getAllByText('This Year')
    await user.click(yearButtons[yearButtons.length - 1])
    await waitFor(() => expect(screen.queryAllByText('All Time')).toHaveLength(1))
  })

  it('shows custom date inputs when value is custom and dropdown is open', async () => {
    const user = userEvent.setup()
    // Render with value=custom so the inputs section is conditionally rendered
    render(<DateFilterDropdown value="custom" onChange={vi.fn()} />)
    // Open dropdown by clicking the trigger button
    await user.click(screen.getByText('Custom Range'))
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument()
    expect(screen.getByLabelText('End Date')).toBeInTheDocument()
  })

  it('calls onChange with custom date range when Apply is clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<DateFilterDropdown value="custom" onChange={onChange} />)
    // Open dropdown
    await user.click(screen.getByText('Custom Range'))
    await user.type(screen.getByLabelText('Start Date'), '2025-01-01')
    await user.type(screen.getByLabelText('End Date'), '2025-06-30')
    await user.click(screen.getByText('Apply'))
    expect(onChange).toHaveBeenCalledWith('custom', '2025-01-01', '2025-06-30')
  })

  it('closes when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <DateFilterDropdown value="all" onChange={vi.fn()} />
        <p data-testid="outside">Outside</p>
      </div>
    )
    await user.click(screen.getByText('All Time'))
    // Dropdown is open: 4 option buttons + 1 trigger = 5 buttons total
    expect(screen.getAllByRole('button').length).toBeGreaterThan(1)
    await user.click(screen.getByTestId('outside'))
    // After close: only the trigger button remains
    await waitFor(() => {
      expect(screen.getAllByRole('button')).toHaveLength(1)
    })
  })
})
