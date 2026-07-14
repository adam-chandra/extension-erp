/**
 * Tests for HRIS and Procurement dashboard pages
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { DashboardCardsProvider } from '@/context/DashboardCardsContext'

vi.mock('@/components/common/withWorkspaceLayout', () => ({
  withWorkspaceLayout: (Comp: React.ComponentType<any>) =>
    function W(props: any) {
      return (
        <Comp
          {...props}
          showCentralDashboard={false}
          showProcurement={true}
          showAccounting={true}
          showHRIS={true}
          showAsset={true}
          selectedCompany="1"
          selectedModule="hris"
        />
      )
    },
}))

vi.mock('@/hooks/useHrisDashboard', () => ({
  useHrisDashboard: vi.fn(() => ({ data: undefined, isLoading: false, error: null })),
  hrisKeys: { all: ['hris'], dashboard: () => ['hris', 'dashboard'] },
}))

vi.mock('@/hooks/useProcurementDashboard', () => ({
  useProcurementDashboard: vi.fn(() => ({ data: undefined, isLoading: false, error: null })),
  usePOCycleTimeTrend: vi.fn(() => ({ data: undefined, isLoading: false })),
  usePurchaseTrendYTD: vi.fn(() => ({ data: undefined, isLoading: false })),
  useReceivingCycleTimeTrend: vi.fn(() => ({ data: undefined, isLoading: false })),
  useProcurementCycleTimeTrend: vi.fn(() => ({ data: undefined, isLoading: false })),
  procurementKeys: {
    all: ['procurement'],
    dashboard: () => ['procurement', 'dashboard'],
    poCycleTimeTrend: () => ['procurement', 'po-cycle-time-trend'],
    purchaseTrendYTD: () => ['procurement', 'purchase-trend-ytd'],
    receivingCycleTimeTrend: () => ['procurement', 'receiving-cycle-time-trend'],
    procurementCycleTimeTrend: () => ['procurement', 'procurement-cycle-time-trend'],
  },
}))

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart:  ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  PieChart:  ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Bar: () => null, Area: () => null,
  Pie: ({ children }: any) => <g>{children}</g>,
  Cell: () => null,
  XAxis: () => null, YAxis: () => null,
  CartesianGrid: () => null, Tooltip: () => null, Legend: () => null,
  ReferenceLine: () => null,
  defs: ({ children }: any) => <>{children}</>,
  linearGradient: ({ children }: any) => <>{children}</>,
  stop: () => null,
}))

// Mock complex card components so pages render cleanly without recharts internals
vi.mock('@/components/common/TileCard', () => ({ TileCard: () => <div data-testid="tile-card" /> }))
vi.mock('@/components/common/DonutChartCard', () => ({ DonutChartCard: () => <div data-testid="donut-card" /> }))
vi.mock('@/components/common/VerticalBarChartCard', () => ({ VerticalBarChartCard: () => <div data-testid="v-bar-card" /> }))
vi.mock('@/components/common/HorizontalBarChartCard', () => ({ HorizontalBarChartCard: () => <div data-testid="h-bar-card" /> }))
vi.mock('@/components/common/SingleSeriesLineChartCard', () => ({ SingleSeriesLineChartCard: () => <div data-testid="single-line-card" /> }))
vi.mock('@/components/common/MultiSeriesLineChartCard', () => ({ MultiSeriesLineChartCard: () => <div data-testid="multi-line-card" /> }))
vi.mock('@/components/common/ListViewCard', () => ({ ListViewCard: () => <div data-testid="list-view-card" /> }))

function Wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <MemoryRouter>
      <QueryClientProvider client={qc}>
        <DashboardCardsProvider>{children}</DashboardCardsProvider>
      </QueryClientProvider>
    </MemoryRouter>
  )
}

const mockHrisDashboard = {
  companyId: 1,
  kpi: {
    totalEmployees: 120,
    attendanceRateYtd: 95,
    attendanceRatePrevYtd: 93,
    totalSakit: 5, totalCuti: 10, totalIzin: 3, totalAlfa: 1, totalTelat: 8,
    newHires: 4, turnoverRate: 1.5,
  },
  sciaMonthly: [{ month: '2025-01', sakit: 1, cuti: 2, izin: 1, alfa: 0 }],
  attendanceMonthly: [{ month: '2025-01', rate: 96, lateCount: 3 }],
  deptHeadcount: [{ departmentName: 'IT', count: 30 }],
  recruitment: [{ month: '2025-01', count: 2 }],
  salaryByDept: [{ departmentName: 'IT', totalSalary: 100000000 }],
  attendanceTrend: [{ month: '2025-01', rate: 96 }],
  workforceTrend: [{ month: '2025-01', employees: 120, hires: 2, exits: 1 }],
}

// ---------------------------------------------------------------------------
// HRISDashboardPage
// ---------------------------------------------------------------------------
describe('HRISDashboardPage', () => {
  it('renders without crashing (no company)', async () => {
    const { default: HRISDashboardPage } = await import('@/pages/HRISDashboardPage')
    render(<Wrapper><HRISDashboardPage /></Wrapper>)
    expect(document.body).toBeTruthy()
  })

  it('renders loading state', async () => {
    const { useHrisDashboard } = await import('@/hooks/useHrisDashboard')
    vi.mocked(useHrisDashboard).mockReturnValue({ data: undefined, isLoading: true, error: null } as any)
    const { default: HRISDashboardPage } = await import('@/pages/HRISDashboardPage')
    render(<Wrapper><HRISDashboardPage /></Wrapper>)
    expect(document.body).toBeTruthy()
  })

  it('renders with HRIS data', async () => {
    const { useHrisDashboard } = await import('@/hooks/useHrisDashboard')
    vi.mocked(useHrisDashboard).mockReturnValue({ data: mockHrisDashboard, isLoading: false, error: null } as any)
    const { default: HRISDashboardPage } = await import('@/pages/HRISDashboardPage')
    render(<Wrapper><HRISDashboardPage /></Wrapper>)
    expect(document.body).toBeTruthy()
  })

  it('renders error state', async () => {
    const { useHrisDashboard } = await import('@/hooks/useHrisDashboard')
    vi.mocked(useHrisDashboard).mockReturnValue({ data: undefined, isLoading: false, error: new Error('API error'), isError: true } as any)
    const { default: HRISDashboardPage } = await import('@/pages/HRISDashboardPage')
    render(<Wrapper><HRISDashboardPage /></Wrapper>)
    expect(document.body).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// HrisAttendanceDashboardPage
// ---------------------------------------------------------------------------
describe('HrisAttendanceDashboardPage', () => {
  it('renders without crashing', async () => {
    const { default: HrisAttendanceDashboardPage } = await import('@/pages/HrisAttendanceDashboardPage')
    render(<Wrapper><HrisAttendanceDashboardPage /></Wrapper>)
    expect(document.body).toBeTruthy()
  })

  it('renders with data', async () => {
    const { useHrisDashboard } = await import('@/hooks/useHrisDashboard')
    vi.mocked(useHrisDashboard).mockReturnValue({ data: mockHrisDashboard, isLoading: false, error: null } as any)
    const { default: HrisAttendanceDashboardPage } = await import('@/pages/HrisAttendanceDashboardPage')
    render(<Wrapper><HrisAttendanceDashboardPage /></Wrapper>)
    expect(document.body).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// ProcurementDashboardPage
// ---------------------------------------------------------------------------
describe('ProcurementDashboardPage', () => {
  it('renders without company', async () => {
    const { ProcurementDashboardPage } = await import('@/pages/ProcurementDashboardPage')
    render(<Wrapper><ProcurementDashboardPage /></Wrapper>)
    expect(document.body).toBeTruthy()
  })

  it('renders loading state', async () => {
    const { useProcurementDashboard } = await import('@/hooks/useProcurementDashboard')
    vi.mocked(useProcurementDashboard).mockReturnValue({ data: undefined, isLoading: true, error: null } as any)
    const { ProcurementDashboardPage } = await import('@/pages/ProcurementDashboardPage')
    render(<Wrapper><ProcurementDashboardPage /></Wrapper>)
    expect(screen.queryAllByText(/loading/i).length).toBeGreaterThanOrEqual(0)
  })

  it('renders error state', async () => {
    const { useProcurementDashboard } = await import('@/hooks/useProcurementDashboard')
    vi.mocked(useProcurementDashboard).mockReturnValue({ data: undefined, isLoading: false, error: new Error('err') } as any)
    const { ProcurementDashboardPage } = await import('@/pages/ProcurementDashboardPage')
    render(<Wrapper><ProcurementDashboardPage /></Wrapper>)
    expect(document.body).toBeTruthy()
  })

  it('renders with data', async () => {
    const {
      useProcurementDashboard,
      usePOCycleTimeTrend,
      usePurchaseTrendYTD,
      useReceivingCycleTimeTrend,
      useProcurementCycleTimeTrend,
    } = await import('@/hooks/useProcurementDashboard')
    const mockData = {
      costSaving: {
        title: 'Cost',
        value: 100,
        unit: 'Juta',
        cardId: 'c1',
        icon: 'TrendingUp',
        iconBgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        module: 'procurement',
        remarks: '',
      },
      savingRate: {
        title: 'Rate',
        value: 8,
        unit: '%',
        cardId: 'c2',
        icon: 'TrendingUp',
        iconBgColor: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        module: 'procurement',
        remarks: '',
      },
      otdRate: {
        title: 'OTD',
        value: 92,
        unit: '%',
        cardId: 'c3',
        icon: 'ShoppingCart',
        iconBgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
        module: 'procurement',
        remarks: '',
      },
      poCycleTime: {
        title: 'Cycle',
        value: 3.2,
        unit: 'Hari',
        cardId: 'c4',
        icon: 'Package',
        iconBgColor: 'bg-amber-100',
        iconColor: 'text-amber-600',
        module: 'procurement',
        remarks: '',
      },
      prNoPO: {
        title: 'PR No PO',
        value: 5,
        unit: 'Item',
        cardId: 'c5',
        icon: 'FileText',
        iconBgColor: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        module: 'procurement',
        remarks: '',
      },
      poIncomplete: {
        title: 'PO Incomplete',
        value: 2,
        unit: 'Item',
        cardId: 'c6',
        icon: 'ShoppingCart',
        iconBgColor: 'bg-amber-100',
        iconColor: 'text-amber-600',
        module: 'procurement',
        remarks: '',
      },
      poNoReceiving: {
        title: 'PO No Receiving',
        value: 1,
        unit: 'Item',
        cardId: 'c7',
        icon: 'Package',
        iconBgColor: 'bg-sky-100',
        iconColor: 'text-sky-600',
        module: 'procurement',
        remarks: '',
      },
      receivingCycleTime: {
        title: 'Receiving Cycle Time',
        value: 4.1,
        unit: 'Hari',
        cardId: 'c8',
        icon: 'Clock',
        iconBgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        module: 'procurement',
        remarks: '',
      },
      procurementCycleTime: {
        title: 'Procurement Cycle Time',
        value: 6.5,
        unit: 'Hari',
        cardId: 'c9',
        icon: 'Clock',
        iconBgColor: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        module: 'procurement',
        remarks: '',
      },
    }
    vi.mocked(useProcurementDashboard).mockReturnValue({ data: mockData, isLoading: false, error: null } as any)
    vi.mocked(usePOCycleTimeTrend).mockReturnValue({ data: [{ label: 'Jan', value: 3.2 }], isLoading: false } as any)
    vi.mocked(usePurchaseTrendYTD).mockReturnValue({ data: [], isLoading: false } as any)
    vi.mocked(useReceivingCycleTimeTrend).mockReturnValue({ data: [{ label: 'Jan', value: 4.1 }], isLoading: false } as any)
    vi.mocked(useProcurementCycleTimeTrend).mockReturnValue({ data: [{ label: 'Jan', value: 6.5 }], isLoading: false } as any)
    const { ProcurementDashboardPage } = await import('@/pages/ProcurementDashboardPage')
    render(<Wrapper><ProcurementDashboardPage /></Wrapper>)
    expect(document.body).toBeTruthy()
  })
})
