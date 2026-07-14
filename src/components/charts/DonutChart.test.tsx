import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DonutChart } from '@/components/charts/DonutChart'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ label, onClick }: any) => <div data-testid="pie" onClick={() => onClick?.({ label: 'test' }, 0)} />,
  Cell: () => null,
}))

const mockData = [
  { label: 'Active', value: 80, color: '#10b981' },
  { label: 'Idle', value: 15, color: '#f59e0b' },
  { label: 'Damage', value: 5, color: '#ef4444' },
]

describe('DonutChart', () => {
  it('renders without crashing', () => {
    render(<DonutChart data={mockData} />)
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('renders center text when provided', () => {
    render(<DonutChart data={mockData} centerText="120" centerSubtext="Total" />)
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('renders default totalLabel when centerSubtext is not provided', () => {
    render(<DonutChart data={mockData} totalLabel="Total Asset" />)
    expect(screen.getByText('Total Asset')).toBeInTheDocument()
  })

  it('renders formatted total with custom valueFormatter', () => {
    render(<DonutChart data={mockData} valueFormatter={(v) => `${v} units`} />)
    expect(screen.getByText('100 units')).toBeInTheDocument()
  })

  it('calls onSegmentClick when segment is clicked and matching data exists', async () => {
    const onSegmentClick = vi.fn()
    const dataWithTestLabel = [{ label: 'test', value: 10, color: '#000' }]
    render(<DonutChart data={dataWithTestLabel} onSegmentClick={onSegmentClick} />)
    await userEvent.click(screen.getByTestId('pie'))
    expect(onSegmentClick).toHaveBeenCalledWith(dataWithTestLabel[0], 0)
  })

  it('does not call onSegmentClick when not provided', async () => {
    render(<DonutChart data={mockData} />)
    // Should not throw
    await userEvent.click(screen.getByTestId('pie'))

    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('renders with showPercentageOnChart=true', () => {
    render(<DonutChart data={mockData} showPercentageOnChart />)
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('renders with custom dimensions', () => {
    render(<DonutChart data={mockData} chartWidth={300} chartHeight={300} />)
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('renders with empty data without crashing', () => {
    render(<DonutChart data={[]} />)
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<DonutChart data={mockData} className="my-donut" />)
    expect(container.querySelector('.my-donut')).toBeInTheDocument()
  })
})
