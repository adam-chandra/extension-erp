import { describe, it, expect } from 'vitest'
import { getAssetDashboardData } from '@/data/asset'

describe('getAssetDashboardData', () => {
  it('returns an AssetDashboardData object', () => {
    const data = getAssetDashboardData(1)
    expect(data).toBeDefined()
    expect(typeof data).toBe('object')
  })

  it('returns a title string', () => {
    const data = getAssetDashboardData(1)
    expect(typeof data.title).toBe('string')
    expect(data.title.length).toBeGreaterThan(0)
  })

  it('returns kpis array with expected structure', () => {
    const data = getAssetDashboardData(1)
    expect(Array.isArray(data.kpis)).toBe(true)
    expect(data.kpis.length).toBeGreaterThan(0)
    const kpi = data.kpis[0]
    expect(kpi).toHaveProperty('label')
    expect(kpi).toHaveProperty('value')
    expect(kpi).toHaveProperty('icon')
    expect(kpi).toHaveProperty('color')
  })

  it('has kpi items with trend data', () => {
    const data = getAssetDashboardData(1)
    const withTrend = data.kpis.filter((k) => k.trend)
    expect(withTrend.length).toBeGreaterThan(0)
    const trend = withTrend[0].trend!
    expect(['up', 'down']).toContain(trend.direction)
    expect(typeof trend.value).toBe('string')
  })

  it('contains lifecycle donut data', () => {
    const data = getAssetDashboardData(1)
    expect(data.lifecycle).toBeDefined()
    expect(Array.isArray(data.lifecycle.donut)).toBe(true)
  })

  it('contains ownership data', () => {
    const data = getAssetDashboardData(1)
    expect(data.ownership).toBeDefined()
    expect(typeof data.ownership.assignedProgress).toBe('number')
  })

  it('contains category rows', () => {
    const data = getAssetDashboardData(1)
    expect(Array.isArray(data.category.rows)).toBe(true)
  })

  it('contains progress area items', () => {
    const data = getAssetDashboardData(1)
    expect(Array.isArray(data.progressArea)).toBe(true)
  })

  it('contains audit stat cards', () => {
    const data = getAssetDashboardData(1)
    expect(data.audit).toBeDefined()
    expect(Array.isArray(data.audit.cards)).toBe(true)
  })

  it('returns same data for any companyId (single data set)', () => {
    const data1 = getAssetDashboardData(1)
    const data2 = getAssetDashboardData(999)
    expect(data1).toBe(data2)
  })
})
