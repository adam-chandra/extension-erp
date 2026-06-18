import { apiClient } from '@/lib/axios'

interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
}

export type DashboardPeriod = 'all' | 'year' | 'month' | 'custom'

export interface DashboardDateRange {
  /** YYYY-MM-DD, required when period='custom' */
  start?: string
  /** YYYY-MM-DD, required when period='custom' */
  end?: string
}

export interface FinanceKPI {
  /** Net Sales: Σ(credit−debit) for all income accounts in the period. */
  salesNet: number
  salesDiscount: number
  salesReturn: number
  /** Cost of Revenue: Σ(debit−credit) for expense accounts 50100%. */
  costOfRevenue: number
}

export interface FinanceTrendPoint {
  month: string // YYYY-MM
  salesNet: number
  costOfRevenue: number
}

export interface FinanceDashboard {
  companyId: number
  period: { code: string; start: string; end: string }
  kpi: FinanceKPI
  trend: FinanceTrendPoint[]
}

export interface FinanceReturLine {
  no: number
  description: string
  date: string
  amount: number
  percentage: number
}

export interface FinanceReturAccountRow {
  no: number
  code: string
  name: string
  balance: number
  percentage: number
}

export const financeService = {
  async dashboard(
    companyId: number,
    period: DashboardPeriod = 'all',
    range?: DashboardDateRange,
  ): Promise<FinanceDashboard> {
    const { data } = await apiClient.get<ApiEnvelope<FinanceDashboard>>('/finance/dashboard', {
      params: { companyId, period, ...(period === 'custom' ? range : {}) },
    })
    return data.data
  },
  async returns(companyId: number, limit = 15): Promise<FinanceReturLine[]> {
    const { data } = await apiClient.get<ApiEnvelope<FinanceReturLine[]>>('/finance/returns', {
      params: { companyId, limit },
    })
    return data.data ?? []
  },
  async returnsByAccount(
    companyId: number,
    period: DashboardPeriod = 'all',
    range?: DashboardDateRange,
    limit = 10,
  ): Promise<FinanceReturAccountRow[]> {
    const { data } = await apiClient.get<ApiEnvelope<FinanceReturAccountRow[]>>(
      '/finance/returns/by-account',
      {
        params: { companyId, period, limit, ...(period === 'custom' ? range : {}) },
      },
    )
    return data.data ?? []
  },
}
