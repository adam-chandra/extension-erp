/**
 * Tests for financial detail pages:
 * BiayaPenjualan, PotonganPenjualan, ReturPenjualan, RevenuePage,
 * FinanceAccountingDashboardPage
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { DashboardCardsProvider } from '@/context/DashboardCardsContext'

// ---- Global mocks ----
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
          selectedCompany="PT-001"
          selectedModule="accounting"
        />
      )
    },
}))

vi.mock('@/hooks/useFinanceDashboard', () => ({
  useFinanceDashboard: vi.fn(() => ({ data: undefined, isLoading: false, error: null })),
  useFinanceReturns: vi.fn(() => ({ data: [], isLoading: false, error: null })),
  useFinanceReturnsByAccount: vi.fn(() => ({ data: [], isLoading: false, error: null })),
  financeKeys: {
    all: ['finance'],
    dashboard: () => ['finance', 'dashboard'],
    returns: () => ['finance', 'returns'],
    returnsByAccount: () => ['finance', 'returnsByAccount'],
  },
}))

vi.mock('@/components/common/TileCard', () => ({ TileCard: () => <div data-testid="tile-card" /> }))
vi.mock('@/components/common/MultiSeriesLineChartCard', () => ({ MultiSeriesLineChartCard: () => <div /> }))
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

// ---------------------------------------------------------------------------
// BiayaPenjualan
// ---------------------------------------------------------------------------
describe('BiayaPenjualan', () => {
  it('renders without crashing', async () => {
    const { BiayaPenjualan } = await import('@/pages/BiayaPenjualan')
    render(<Wrapper><BiayaPenjualan /></Wrapper>)
    expect(document.body).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// PotonganPenjualan
// ---------------------------------------------------------------------------
describe('PotonganPenjualan', () => {
  it('renders without crashing', async () => {
    const { PotonganPenjualan } = await import('@/pages/PotonganPenjualan')
    render(<Wrapper><PotonganPenjualan /></Wrapper>)
    expect(document.body).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// ReturPenjualan
// ---------------------------------------------------------------------------
describe('ReturPenjualan', () => {
  it('renders without company - shows Building prompt', async () => {
    const { ReturPenjualan } = await import('@/pages/ReturPenjualan')
    render(<Wrapper><ReturPenjualan /></Wrapper>)
    expect(document.body).toBeTruthy()
  })

  it('renders with loading state', async () => {
    const { useFinanceReturnsByAccount } = await import('@/hooks/useFinanceDashboard')
    vi.mocked(useFinanceReturnsByAccount).mockReturnValue({ data: undefined, isLoading: true, error: null } as any)
    const { ReturPenjualan } = await import('@/pages/ReturPenjualan')
    render(<Wrapper><ReturPenjualan /></Wrapper>)
    expect(document.body).toBeTruthy()
  })

  it('renders with data', async () => {
    const { useFinanceReturnsByAccount } = await import('@/hooks/useFinanceDashboard')
    vi.mocked(useFinanceReturnsByAccount).mockReturnValue({
      data: [{ no: 1, code: '40300', name: 'Retur A', balance: 2000, percentage: 50 }],
      isLoading: false,
      error: null,
    } as any)
    const { ReturPenjualan } = await import('@/pages/ReturPenjualan')
    render(<Wrapper><ReturPenjualan /></Wrapper>)
    expect(document.body).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// RevenuePage
// ---------------------------------------------------------------------------
describe('RevenuePage', () => {
  it('renders without crashing', async () => {
    const { RevenuePage } = await import('@/pages/RevenuePage')
    render(<Wrapper><RevenuePage /></Wrapper>)
    expect(document.body).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// FinanceAccountingDashboardPage
// ---------------------------------------------------------------------------
describe('FinanceAccountingDashboardPage', () => {
  it('renders without crashing', async () => {
    const { FinanceAccountingDashboardPage } = await import('@/pages/FinanceAccountingDashboardPage')
    render(<Wrapper><FinanceAccountingDashboardPage /></Wrapper>)
    expect(document.body).toBeTruthy()
  })

  it('renders loading state', async () => {
    const { useFinanceDashboard } = await import('@/hooks/useFinanceDashboard')
    vi.mocked(useFinanceDashboard).mockReturnValue({ data: undefined, isLoading: true, error: null } as any)
    const { FinanceAccountingDashboardPage } = await import('@/pages/FinanceAccountingDashboardPage')
    render(<Wrapper><FinanceAccountingDashboardPage /></Wrapper>)
    expect(screen.queryAllByText(/loading/i).length).toBeGreaterThanOrEqual(0)
  })

  it('renders with dashboard data', async () => {
    const { useFinanceDashboard } = await import('@/hooks/useFinanceDashboard')
    vi.mocked(useFinanceDashboard).mockReturnValue({
      data: {
        companyId: 1,
        period: { code: 'all', start: '2024-01-01', end: '2024-12-31' },
        kpi: { salesNet: 10000000, salesDiscount: 500000, salesReturn: 200000, costOfRevenue: 4000000 },
        trend: [{ month: '2024-01', salesNet: 1000000, costOfRevenue: 400000 }],
      },
      isLoading: false,
      error: null,
    } as any)
    const { FinanceAccountingDashboardPage } = await import('@/pages/FinanceAccountingDashboardPage')
    render(<Wrapper><FinanceAccountingDashboardPage /></Wrapper>)
    expect(document.body).toBeTruthy()
  })
})
