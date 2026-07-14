import { describe, it, expect, vi, beforeEach } from 'vitest'
import { hrisService } from '@/services/hris.service'

vi.mock('@/lib/axios', () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}))

import { apiClient } from '@/lib/axios'
const mockGet = vi.mocked(apiClient.get)

function envelope<T>(data: T) {
  return { data: { code: 200, message: 'ok', data } }
}

beforeEach(() => vi.clearAllMocks())

describe('hrisService.dashboard', () => {
  const mockDashboard = {
    companyId: 1,
    kpi: { totalEmployees: 120, attendanceRateYtd: 95, attendanceRatePrevYtd: 93, totalSakit: 5, totalCuti: 10, totalIzin: 3, totalAlfa: 1, totalTelat: 8 },
    sciaMonthly: [{ month: '2025-01', sakit: 1, cuti: 2, izin: 1, alfa: 0 }],
    attendanceMonthly: [{ month: '2025-01', rate: 96, lateCount: 3 }],
  }

  it('returns dashboard data', async () => {
    mockGet.mockResolvedValue(envelope(mockDashboard))
    const result = await hrisService.dashboard(1, 2025)
    expect(result.kpi.totalEmployees).toBe(120)
    expect(result.sciaMonthly).toHaveLength(1)
  })

  it('calls the correct endpoint with params', async () => {
    mockGet.mockResolvedValue(envelope(mockDashboard))
    await hrisService.dashboard(2, 2024)
    expect(mockGet).toHaveBeenCalledWith('/hris/dashboard', { params: { companyId: 2, year: 2024 } })
  })

  it('propagates API errors', async () => {
    mockGet.mockRejectedValue(new Error('Server error'))
    await expect(hrisService.dashboard(1, 2025)).rejects.toThrow()
  })
})
