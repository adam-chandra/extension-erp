import { describe, it, expect, vi, beforeEach } from 'vitest'
import { procurementService } from '@/services/procurement.service'

vi.mock('@/lib/axios', () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}))

import { apiClient } from '@/lib/axios'
const mockGet = vi.mocked(apiClient.get)

function envelope<T>(data: T) {
  return { data: { code: 200, message: 'ok', data } }
}

const mockResponse = {
  company_id: 1,
  cost_saving: { title: 'Cost Saving', value: 120, unit: 'Juta', remarks: 'desc' },
  saving_rate: { title: '% Saving', value: 8.5, unit: '%', remarks: 'desc' },
  otd_rate: { title: 'OTD', value: 92, unit: '%', remarks: 'desc' },
  po_cycle_time: { title: 'Cycle Time', value: 3.2, unit: 'Hari', remarks: 'desc' },
}

beforeEach(() => vi.clearAllMocks())

describe('procurementService.getDashboard', () => {
  it('returns merged dashboard data on success', async () => {
    mockGet.mockResolvedValue(envelope(mockResponse))
    const result = await procurementService.getDashboard('1')
    expect(result.costSaving.value).toBe(120)
    expect(result.savingRate.value).toBe(8.5)
    expect(result.otdRate.value).toBe(92)
    expect(result.poCycleTime.value).toBe(3.2)
  })

  it('falls back to mock data when API throws', async () => {
    mockGet.mockRejectedValue(new Error('500'))
    const result = await procurementService.getDashboard('1')
    // Should still return an object (from mock data)
    expect(result).toHaveProperty('costSaving')
    expect(result).toHaveProperty('poCycleTime')
  })

  it('passes filters to API params', async () => {
    mockGet.mockResolvedValue(envelope(mockResponse))
    await procurementService.getDashboard('1', { dateFilter: 'year', companyId: '1' })
    expect(mockGet).toHaveBeenCalledWith('/procurement/dashboard', expect.objectContaining({
      params: expect.objectContaining({ period: 'year' }),
    }))
  })

  it('passes custom date range when dateFilter is custom', async () => {
    mockGet.mockResolvedValue(envelope(mockResponse))
    await procurementService.getDashboard('1', {
      dateFilter: 'custom',
      dateRange: { startDate: '2025-01-01', endDate: '2025-06-30' },
      companyId: '1',
    })
    expect(mockGet).toHaveBeenCalledWith('/procurement/dashboard', expect.objectContaining({
      params: expect.objectContaining({ start: '2025-01-01', end: '2025-06-30' }),
    }))
  })
})

describe('procurementService.getPOCycleTimeTrend', () => {
  it('returns trend data on success', async () => {
    const trend = [{ label: 'Jan', value: 3.2 }, { label: 'Feb', value: 2.8 }]
    mockGet.mockResolvedValue(envelope(trend))
    const result = await procurementService.getPOCycleTimeTrend('1')
    expect(result).toHaveLength(2)
    expect(result[0].label).toBe('Jan')
  })

  it('falls back to mock data on API error', async () => {
    mockGet.mockRejectedValue(new Error('timeout'))
    const result = await procurementService.getPOCycleTimeTrend('1')
    expect(Array.isArray(result)).toBe(true)
  })
})

describe('procurementService.getPurchaseTrendYTD', () => {
  it('returns YTD trend data on success', async () => {
    const trend = [{ label: 'Jan', ytd_this_year: 500, ytd_last_year: 480 }]
    mockGet.mockResolvedValue(envelope(trend))
    const result = await procurementService.getPurchaseTrendYTD('1')
    expect(result).toHaveLength(1)
    expect(result[0].ytd_this_year).toBe(500)
  })

  it('falls back to mock data on API error', async () => {
    mockGet.mockRejectedValue(new Error('error'))
    const result = await procurementService.getPurchaseTrendYTD('1')
    expect(Array.isArray(result)).toBe(true)
  })
})
