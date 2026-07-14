/**
 * Tests for all recharts-based card components.
 * Recharts is mocked so tests run in jsdom without SVG measurement issues.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardCardsProvider } from '@/context/DashboardCardsContext'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive">{children}</div>,
  BarChart:  ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  PieChart:  ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Bar:           () => null,
  Area:          () => null,
  Pie:           ({ children }: any) => <g>{children}</g>,
  Cell:          () => null,
  XAxis:         () => null,
  YAxis:         () => null,
  CartesianGrid: () => null,
  Tooltip:       () => null,
  Legend:        () => null,
  ReferenceLine: () => null,
  defs:          ({ children }: any) => <defs>{children}</defs>,
  linearGradient:({ children }: any) => <linearGradient>{children}</linearGradient>,
  stop:          () => null,
}))

function Provider({ children }: { children: React.ReactNode }) {
  return <DashboardCardsProvider>{children}</DashboardCardsProvider>
}

// ---------------------------------------------------------------------------
// DonutChartCard
// ---------------------------------------------------------------------------
import { DonutChartCard } from '@/components/common/DonutChartCard'

const donutData = [
  { label: 'Active', value: 80, color: '#10b981' },
  { label: 'Idle',   value: 20, color: '#f59e0b' },
]

describe('DonutChartCard', () => {
  it('renders title', () => {
    render(<Provider><DonutChartCard title="Asset Status" data={donutData} /></Provider>)
    expect(screen.getByText('Asset Status')).toBeInTheDocument()
  })

  it('renders total label', () => {
    render(<Provider><DonutChartCard title="Status" data={donutData} totalLabel="Total Unit" /></Provider>)
    expect(screen.getByText('Total Unit')).toBeInTheDocument()
  })

  it('renders formatted total using valueFormatter', () => {
    render(<Provider><DonutChartCard title="T" data={donutData} valueFormatter={(v) => `${v} unit`} /></Provider>)
    expect(screen.getByText('100 unit')).toBeInTheDocument()
  })

  it('renders CardMenu when cardId and module provided', () => {
    render(<Provider><DonutChartCard title="T" data={donutData} cardId="donut-1" module="accounting" /></Provider>)
    expect(screen.getByLabelText('Card menu')).toBeInTheDocument()
  })

  it('renders customMenu when provided', () => {
    render(<Provider><DonutChartCard title="T" data={donutData} customMenu={<button>Custom</button>} /></Provider>)
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })

  it('renders without menu when no cardId or customMenu', () => {
    render(<Provider><DonutChartCard title="T" data={donutData} /></Provider>)
    expect(screen.queryByLabelText('Card menu')).toBeNull()
  })

  it('renders with empty data', () => {
    render(<Provider><DonutChartCard title="Empty" data={[]} /></Provider>)
    expect(screen.getByText('Empty')).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// HorizontalBarChartCard
// ---------------------------------------------------------------------------
import { HorizontalBarChartCard } from '@/components/common/HorizontalBarChartCard'

const barSeries = [{ key: 'value', label: 'Revenue', color: '#3b82f6' }]
const barData = [{ label: 'Jan', value: 100 }, { label: 'Feb', value: 200 }]

describe('HorizontalBarChartCard', () => {
  it('renders title', () => {
    render(<Provider><HorizontalBarChartCard title="Monthly Revenue" series={barSeries} data={barData} /></Provider>)
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument()
  })

  it('renders with cardId and module (shows menu)', () => {
    render(<Provider><HorizontalBarChartCard title="T" series={barSeries} data={barData} cardId="h-bar-1" module="accounting" /></Provider>)
    expect(screen.getByLabelText('Card menu')).toBeInTheDocument()
  })

  it('renders with customMenu', () => {
    render(<Provider><HorizontalBarChartCard title="T" series={barSeries} data={barData} customMenu={<button>Action</button>} /></Provider>)
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('renders without menu by default', () => {
    render(<Provider><HorizontalBarChartCard title="T" series={barSeries} data={barData} /></Provider>)
    expect(screen.queryByLabelText('Card menu')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// VerticalBarChartCard
// ---------------------------------------------------------------------------
import { VerticalBarChartCard } from '@/components/common/VerticalBarChartCard'

describe('VerticalBarChartCard', () => {
  it('renders title', () => {
    render(<Provider><VerticalBarChartCard title="Sales by Month" series={barSeries} data={barData} /></Provider>)
    expect(screen.getByText('Sales by Month')).toBeInTheDocument()
  })

  it('renders with menu', () => {
    render(<Provider><VerticalBarChartCard title="T" series={barSeries} data={barData} cardId="v-bar-1" module="accounting" /></Provider>)
    expect(screen.getByLabelText('Card menu')).toBeInTheDocument()
  })

  it('renders multiple series', () => {
    const multiSeries = [
      { key: 'a', label: 'Series A', color: '#3b82f6' },
      { key: 'b', label: 'Series B', color: '#ef4444' },
    ]
    render(<Provider><VerticalBarChartCard title="Multi" series={multiSeries} data={barData} /></Provider>)
    expect(screen.getByText('Multi')).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// PieChartCard
// ---------------------------------------------------------------------------
import { PieChartCard } from '@/components/common/PieChartCard'

const pieData = [
  { label: 'Category A', value: 40, color: '#3b82f6' },
  { label: 'Category B', value: 35, color: '#ef4444' },
  { label: 'Category C', value: 25, color: '#10b981' },
]

describe('PieChartCard', () => {
  it('renders title', () => {
    render(<Provider><PieChartCard title="Distribution" data={pieData} /></Provider>)
    expect(screen.getByText('Distribution')).toBeInTheDocument()
  })

  it('renders with default unit (%)', () => {
    render(<Provider><PieChartCard title="T" data={pieData} /></Provider>)
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('renders with custom unit', () => {
    render(<Provider><PieChartCard title="T" data={pieData} unit="units" /></Provider>)
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('renders with cardId and module (shows menu)', () => {
    render(<Provider><PieChartCard title="T" data={pieData} cardId="pie-1" module="accounting" /></Provider>)
    expect(screen.getByLabelText('Card menu')).toBeInTheDocument()
  })

  it('renders without menu by default', () => {
    render(<Provider><PieChartCard title="T" data={pieData} /></Provider>)
    expect(screen.queryByLabelText('Card menu')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// SingleSeriesLineChartCard
// ---------------------------------------------------------------------------
import { SingleSeriesLineChartCard } from '@/components/common/SingleSeriesLineChartCard'

const lineData = [
  { label: 'Jan', value: 3.2 },
  { label: 'Feb', value: 2.8 },
  { label: 'Mar', value: 4.1 },
]

describe('SingleSeriesLineChartCard', () => {
  it('renders title', () => {
    render(<Provider><SingleSeriesLineChartCard title="PO Cycle Time" seriesLabel="Actual" data={lineData} /></Provider>)
    expect(screen.getByText('PO Cycle Time')).toBeInTheDocument()
  })

  it('renders remarks when provided', () => {
    render(<Provider><SingleSeriesLineChartCard title="T" seriesLabel="A" data={lineData} remarks="subtitle note" /></Provider>)
    expect(screen.getByText('subtitle note')).toBeInTheDocument()
  })

  it('renders with target line when targetValue provided', () => {
    render(<Provider>
      <SingleSeriesLineChartCard
        title="T" seriesLabel="A" data={lineData}
        targetValue={5.0} targetLabel="Target" color="#3b82f6"
      />
    </Provider>)
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })

  it('renders with showDataLabels=true', () => {
    render(<Provider><SingleSeriesLineChartCard title="T" seriesLabel="A" data={lineData} showDataLabels /></Provider>)
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })

  it('renders with cardId and module (shows menu)', () => {
    render(<Provider><SingleSeriesLineChartCard title="T" seriesLabel="A" data={lineData} cardId="line-1" module="procurement" /></Provider>)
    expect(screen.getByLabelText('Card menu')).toBeInTheDocument()
  })

  it('renders without menu by default', () => {
    render(<Provider><SingleSeriesLineChartCard title="T" seriesLabel="A" data={lineData} /></Provider>)
    expect(screen.queryByLabelText('Card menu')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// MultiSeriesLineChartCard
// ---------------------------------------------------------------------------
import { MultiSeriesLineChartCard } from '@/components/common/MultiSeriesLineChartCard'

const multiSeries = [
  { key: 'ytd_this_year', label: 'YTD This Year',  color: '#3b82f6' },
  { key: 'ytd_last_year', label: 'YTD Last Year',  color: '#9ca3af', dashed: true },
]
const multiData = [
  { label: 'Jan', ytd_this_year: 500, ytd_last_year: 480 },
  { label: 'Feb', ytd_this_year: 620, ytd_last_year: 590 },
]

describe('MultiSeriesLineChartCard', () => {
  it('renders title', () => {
    render(<Provider><MultiSeriesLineChartCard title="Trend YTD" series={multiSeries} data={multiData} /></Provider>)
    expect(screen.getByText('Trend YTD')).toBeInTheDocument()
  })

  it('renders remarks when provided', () => {
    render(<Provider><MultiSeriesLineChartCard title="T" series={multiSeries} data={multiData} remarks="year-over-year" /></Provider>)
    expect(screen.getByText('year-over-year')).toBeInTheDocument()
  })

  it('renders with cardId and module (shows menu)', () => {
    render(<Provider><MultiSeriesLineChartCard title="T" series={multiSeries} data={multiData} cardId="multi-1" module="procurement" /></Provider>)
    expect(screen.getByLabelText('Card menu')).toBeInTheDocument()
  })

  it('renders with customMenu', () => {
    render(<Provider><MultiSeriesLineChartCard title="T" series={multiSeries} data={multiData} customMenu={<button>Act</button>} /></Provider>)
    expect(screen.getByText('Act')).toBeInTheDocument()
  })

  it('renders with dashed series (triggers SeriesLegend)', () => {
    render(<Provider><MultiSeriesLineChartCard title="T" series={multiSeries} data={multiData} /></Provider>)
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })

  it('renders with no dashed series', () => {
    const solidSeries = multiSeries.map((s) => ({ ...s, dashed: false }))
    render(<Provider><MultiSeriesLineChartCard title="T" series={solidSeries} data={multiData} /></Provider>)
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })

  it('renders with showDataLabels=true', () => {
    render(<Provider><MultiSeriesLineChartCard title="T" series={multiSeries} data={multiData} showDataLabels /></Provider>)
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })

  it('renders with custom yAxisFormatter', () => {
    render(<Provider><MultiSeriesLineChartCard title="T" series={multiSeries} data={multiData} yAxisFormatter={(v) => `${v}M`} /></Provider>)
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })
})
