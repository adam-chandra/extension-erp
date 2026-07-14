import { describe, it, expect, vi, beforeEach } from 'vitest'
import { financeService } from '@/services/finance.service'

vi.mock('@/lib/axios', () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}))

import { apiClient } from '@/lib/axios'
const mockGet = vi.mocked(apiClient.get)

function envelope<T>(data: T) {
  return { data: { code: 200, message: 'ok', data } }
}

beforeEach(() => vi.clearAllMocks())

describe('financeService.dashboard', () => {
  it('fetches dashboard with default period', async () => {
    const mockDashboard = { companyId: 1, period: { code: 'all', start: '2024-01-01', end: '2024-12-31' }, kpi: { salesNet: 100, salesDiscount: 5, salesReturn: 3, costOfRevenue: 40 }, trend: [] }
    mockGet.mockResolvedValue(envelope(mockDashboard))

    const result = await financeService.dashboard(1)
    expect(result.companyId).toBe(1)
    expect(result.kpi.salesNet).toBe(100)
    expect(mockGet).toHaveBeenCalledWith('/finance/dashboard', expect.objectContaining({ params: expect.objectContaining({ companyId: 1, period: 'all' }) }))
  })

  it('passes custom range params when period is custom', async () => {
    mockGet.mockResolvedValue(envelope({ companyId: 1, period: {}, kpi: {}, trend: [] }))
    await financeService.dashboard(1, 'custom', { start: '2025-01-01', end: '2025-06-30' })
    expect(mockGet).toHaveBeenCalledWith('/finance/dashboard', expect.objectContaining({
      params: expect.objectContaining({ start: '2025-01-01', end: '2025-06-30' }),
    }))
  })

  it('does NOT pass range params for non-custom period', async () => {
    mockGet.mockResolvedValue(envelope({ companyId: 1, period: {}, kpi: {}, trend: [] }))
    await financeService.dashboard(1, 'year', { start: '2025-01-01', end: '2025-12-31' })
    const call = mockGet.mock.calls[0][1] as any
    expect(call.params.start).toBeUndefined()
  })
})

describe('financeService.returns', () => {
  it('returns the data array', async () => {
    const lines = [{ no: 1, description: 'Item A', date: '2025-01-01', amount: 5000, percentage: 50 }]
    mockGet.mockResolvedValue(envelope(lines))

    const result = await financeService.returns(1)
    expect(result).toHaveLength(1)
    expect(result[0].description).toBe('Item A')
  })

  it('returns empty array when data is null/undefined', async () => {
    mockGet.mockResolvedValue(envelope(null))
    const result = await financeService.returns(1, 5)
    expect(result).toEqual([])
  })
})

describe('financeService.returnsByAccount', () => {
  it('fetches by-account data', async () => {
    const rows = [{ no: 1, code: '40300', name: 'Retur A', balance: 2000, percentage: 60 }]
    mockGet.mockResolvedValue(envelope(rows))

    const result = await financeService.returnsByAccount(1)
    expect(result).toHaveLength(1)
    expect(result[0].code).toBe('40300')
  })

  it('passes custom range for custom period', async () => {
    mockGet.mockResolvedValue(envelope([]))
    await financeService.returnsByAccount(1, 'custom', { start: '2025-03-01', end: '2025-03-31' })
    expect(mockGet).toHaveBeenCalledWith('/finance/returns/by-account', expect.objectContaining({
      params: expect.objectContaining({ start: '2025-03-01' }),
    }))
  })
})
