import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BarChart } from '@/components/charts/BarChart'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive">{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: ({ label }: any) => <div data-testid="bar">{label}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  defs: ({ children }: any) => <>{children}</>,
  linearGradient: ({ children }: any) => <>{children}</>,
  stop: () => null,
}))

const mockData = [
  { name: 'Jan', value: 1000 },
  { name: 'Feb', value: 2000 },
  { name: 'Mar', value: 1500 },
]

describe('BarChart', () => {
  it('renders without crashing with default props', () => {
    render(<BarChart data={mockData} />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('renders with custom fill color', () => {
    render(<BarChart data={mockData} fill="#82ca9d" />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('renders with gradient=false', () => {
    render(<BarChart data={mockData} gradient={false} />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('renders with showLabels=false', () => {
    render(<BarChart data={mockData} showLabels={false} />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('renders with showGrid=false', () => {
    render(<BarChart data={mockData} showGrid={false} />)
    expect(screen.queryByTestId('grid')).toBeNull()
  })

  it('renders with showYAxis=false', () => {
    render(<BarChart data={mockData} showYAxis={false} />)
    expect(screen.queryByTestId('y-axis')).toBeNull()
  })

  it('renders with showXAxis=false', () => {
    render(<BarChart data={mockData} showXAxis={false} />)
    expect(screen.queryByTestId('x-axis')).toBeNull()
  })

  it('renders with animated=false', () => {
    render(<BarChart data={mockData} animated={false} />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('applies all color variants for fill prop', () => {
    const fills = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#4facfe', '#ff6b6b', '#f9ca24', '#unknown']
    fills.forEach((fill) => {
      const { unmount } = render(<BarChart data={mockData} fill={fill} />)
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
      unmount()
    })
  })

  it('renders with custom className', () => {
    const { container } = render(<BarChart data={mockData} className="my-custom" />)
    expect(container.querySelector('.my-custom')).toBeInTheDocument()
  })

  it('renders with empty data array', () => {
    render(<BarChart data={[]} />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })
})
