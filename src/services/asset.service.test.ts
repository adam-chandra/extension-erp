import { describe, it, expect, vi, beforeEach } from 'vitest'
import { assetService } from '@/services/asset.service'

vi.mock('@/lib/axios', () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}))

import { apiClient } from '@/lib/axios'
const mockGet = vi.mocked(apiClient.get)

beforeEach(() => vi.clearAllMocks())

describe('assetService.getDashboardSummary', () => {
  const mockSummary = {
    totalUnitAsset: 100,
    totalAssetValue: 5_000_000_000,
    status: { active: 80, idle: 10, damage: 7, missing: 3 },
  }

  it('returns dashboard summary data', async () => {
    mockGet.mockResolvedValue({ data: { data: mockSummary } })
    const result = await assetService.getDashboardSummary(1)
    expect(result.totalUnitAsset).toBe(100)
    expect(result.status.active).toBe(80)
  })

  it('calls the correct endpoint with companyId param', async () => {
    mockGet.mockResolvedValue({ data: { data: mockSummary } })
    await assetService.getDashboardSummary(42)
    expect(mockGet).toHaveBeenCalledWith('/asset/dashboard', { params: { companyId: 42 } })
  })

  it('propagates API errors', async () => {
    mockGet.mockRejectedValue(new Error('Not Found'))
    await expect(assetService.getDashboardSummary(1)).rejects.toThrow()
  })
})
