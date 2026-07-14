import { describe, it, expect } from 'vitest'
import {
  getMockProcurementDashboard,
  getMockPOCycleTimeTrend,
  getMockPurchaseTrendYTD,
  procurementMetricConfig,
} from '@/data/procurement-mock'

describe('getMockProcurementDashboard', () => {
  it('returns a fallback dashboard response object', () => {
    const result = getMockProcurementDashboard()
    expect(result).toBeDefined()
    expect(result).toHaveProperty('company_id')
    expect(result).toHaveProperty('cost_saving')
    expect(result).toHaveProperty('saving_rate')
    expect(result).toHaveProperty('otd_rate')
    expect(result).toHaveProperty('po_cycle_time')
  })

  it('returns zero values in fallback data', () => {
    const result = getMockProcurementDashboard()
    expect(result.cost_saving.value).toBe(0)
    expect(result.saving_rate.value).toBe(0)
    expect(result.otd_rate.value).toBe(0)
    expect(result.po_cycle_time.value).toBe(0)
  })
})

describe('getMockPOCycleTimeTrend', () => {
  it('returns an array', () => {
    const result = getMockPOCycleTimeTrend()
    expect(Array.isArray(result)).toBe(true)
  })
})

describe('getMockPurchaseTrendYTD', () => {
  it('returns an array', () => {
    const result = getMockPurchaseTrendYTD()
    expect(Array.isArray(result)).toBe(true)
  })
})

describe('procurementMetricConfig', () => {
  it('has costSaving config with cardId', () => {
    expect(procurementMetricConfig.costSaving.cardId).toBe('proc-tile-cost-saving')
  })

  it('has all 4 metric configs', () => {
    expect(procurementMetricConfig).toHaveProperty('costSaving')
    expect(procurementMetricConfig).toHaveProperty('savingRate')
    expect(procurementMetricConfig).toHaveProperty('otdRate')
    expect(procurementMetricConfig).toHaveProperty('poCycleTime')
  })

  it('each config has icon, iconBgColor, iconColor, cardId', () => {
    Object.values(procurementMetricConfig).forEach((cfg) => {
      expect(cfg).toHaveProperty('icon')
      expect(cfg).toHaveProperty('iconBgColor')
      expect(cfg).toHaveProperty('iconColor')
      expect(cfg).toHaveProperty('cardId')
    })
  })
})
