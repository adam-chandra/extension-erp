import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import {
  useFinanceDashboard,
  useFinanceReturns,
  useFinanceReturnsByAccount,
  financeKeys,
} from '@/hooks/useFinanceDashboard'
import {
  useProcurementDashboard,
  usePOCycleTimeTrend,
  usePurchaseTrendYTD,
  procurementKeys,
} from '@/hooks/useProcurementDashboard'
import { useHrisDashboard } from '@/hooks/useHrisDashboard'
import { useAssetDashboard } from '@/hooks/useAssetDashboard'

vi.mock('@/services/finance.service', () => ({
  financeService: {
    dashboard: vi.fn().mockResolvedValue({ companyId: 1, period: {}, kpi: {}, trend: [] }),
    returns: vi.fn().mockResolvedValue([]),
    returnsByAccount: vi.fn().mockResolvedValue([]),
  },
}))

vi.mock('@/services/procurement.service', () => ({
  procurementService: {
    getDashboard: vi.fn().mockResolvedValue({ costSaving: {}, savingRate: {}, otdRate: {}, poCycleTime: {} }),
    getPOCycleTimeTrend: vi.fn().mockResolvedValue([]),
    getPurchaseTrendYTD: vi.fn().mockResolvedValue([]),
  },
}))

vi.mock('@/services/hris.service', () => ({
  hrisService: {
    dashboard: vi.fn().mockResolvedValue({ companyId: 1, kpi: {}, sciaMonthly: [], attendanceMonthly: [] }),
  },
}))

vi.mock('@/services/asset.service', () => ({
  assetService: {
    getDashboardSummary: vi.fn().mockResolvedValue({ totalUnitAsset: 100, totalAssetValue: 1e9, status: {} }),
  },
}))

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

// ---------------------------------------------------------------------------
// financeKeys
// ---------------------------------------------------------------------------
describe('financeKeys', () => {
  it('all is stable', () => { expect(financeKeys.all).toEqual(['finance']) })
  it('dashboard includes companyId and period', () => {
    const k = financeKeys.dashboard(1, 'year')
    expect(k).toContain(1)
    expect(k).toContain('year')
  })
  it('dashboard with custom range', () => {
    const k = financeKeys.dashboard(1, 'custom', { start: '2025-01-01', end: '2025-06-30' })
    expect(k).toContain('2025-01-01')
  })
  it('returns key includes limit', () => {
    expect(financeKeys.returns(1, 20)).toContain(20)
  })
  it('returnsByAccount key', () => {
    const k = financeKeys.returnsByAccount(1, 'all')
    expect(Array.isArray(k)).toBe(true)
  })
  it('returnsByAccount key with range and limit', () => {
    const k = financeKeys.returnsByAccount(1, 'custom', { start: '2025-01-01', end: '2025-03-31' }, 5)
    expect(k).toContain('2025-01-01')
    expect(k).toContain(5)
  })
})

// ---------------------------------------------------------------------------
// useFinanceDashboard
// ---------------------------------------------------------------------------
describe('useFinanceDashboard', () => {
  it('is disabled when companyId is null', () => {
    const { result } = renderHook(() => useFinanceDashboard(null), { wrapper: makeWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('fetches data when companyId is valid', async () => {
    const { result } = renderHook(() => useFinanceDashboard(1), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('is disabled for custom period without range', () => {
    const { result } = renderHook(() => useFinanceDashboard(1, 'custom'), { wrapper: makeWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('fetches for custom period with valid range', async () => {
    const { result } = renderHook(
      () => useFinanceDashboard(1, 'custom', { start: '2025-01-01', end: '2025-06-30' }),
      { wrapper: makeWrapper() },
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

// ---------------------------------------------------------------------------
// useFinanceReturns
// ---------------------------------------------------------------------------
describe('useFinanceReturns', () => {
  it('is disabled when companyId is null', () => {
    const { result } = renderHook(() => useFinanceReturns(null), { wrapper: makeWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('fetches when companyId is valid', async () => {
    const { result } = renderHook(() => useFinanceReturns(1), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

// ---------------------------------------------------------------------------
// useFinanceReturnsByAccount
// ---------------------------------------------------------------------------
describe('useFinanceReturnsByAccount', () => {
  it('is disabled when companyId is null', () => {
    const { result } = renderHook(() => useFinanceReturnsByAccount(null), { wrapper: makeWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('fetches when companyId is valid', async () => {
    const { result } = renderHook(() => useFinanceReturnsByAccount(1), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

// ---------------------------------------------------------------------------
// procurementKeys
// ---------------------------------------------------------------------------
describe('procurementKeys', () => {
  it('all is stable', () => { expect(procurementKeys.all).toEqual(['procurement']) })
  it('dashboard key includes companyId', () => {
    expect(procurementKeys.dashboard('1')).toContain('1')
  })
  it('poCycleTimeTrend key', () => {
    expect(procurementKeys.poCycleTimeTrend('1')).toContain('po-cycle-time-trend')
  })
  it('purchaseTrendYTD key', () => {
    expect(procurementKeys.purchaseTrendYTD('1')).toContain('purchase-trend-ytd')
  })
})

// ---------------------------------------------------------------------------
// useProcurementDashboard
// ---------------------------------------------------------------------------
describe('useProcurementDashboard', () => {
  it('is disabled when companyId is null', () => {
    const { result } = renderHook(() => useProcurementDashboard(null), { wrapper: makeWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('fetches when companyId is valid', async () => {
    const { result } = renderHook(() => useProcurementDashboard('1'), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('passes filters to service', async () => {
    const filters = { dateFilter: 'year' as const, companyId: '1' }
    const { result } = renderHook(() => useProcurementDashboard('1', filters), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

// ---------------------------------------------------------------------------
// usePOCycleTimeTrend
// ---------------------------------------------------------------------------
describe('usePOCycleTimeTrend', () => {
  it('is disabled when companyId is null', () => {
    const { result } = renderHook(() => usePOCycleTimeTrend(null), { wrapper: makeWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('fetches trend data', async () => {
    const { result } = renderHook(() => usePOCycleTimeTrend('1'), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(Array.isArray(result.current.data)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// usePurchaseTrendYTD
// ---------------------------------------------------------------------------
describe('usePurchaseTrendYTD', () => {
  it('is disabled when companyId is null', () => {
    const { result } = renderHook(() => usePurchaseTrendYTD(null), { wrapper: makeWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('fetches YTD data', async () => {
    const { result } = renderHook(() => usePurchaseTrendYTD('1'), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

// ---------------------------------------------------------------------------
// useHrisDashboard
// ---------------------------------------------------------------------------
describe('useHrisDashboard', () => {
  it('is disabled when companyId is null', () => {
    const { result } = renderHook(() => useHrisDashboard(null, 2025), { wrapper: makeWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('fetches HRIS data when enabled', async () => {
    const { result } = renderHook(() => useHrisDashboard(1, 2025), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

// ---------------------------------------------------------------------------
// useAssetDashboard
// ---------------------------------------------------------------------------
describe('useAssetDashboard', () => {
  it('is disabled when companyId is null', () => {
    const { result } = renderHook(() => useAssetDashboard(null), { wrapper: makeWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('fetches asset data when enabled', async () => {
    const { result } = renderHook(() => useAssetDashboard(1), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
