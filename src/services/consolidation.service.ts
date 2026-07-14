import { apiClient } from '@/lib/axios'

interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface ConsolidationReportRequest {
  companyIds: number[]
  startDate: string   // YYYY-MM-DD
  endDate: string     // YYYY-MM-DD
  reportType: 'profit_loss' | 'balance_sheet'
  includeElimination: boolean
}

export interface EliminationEntriesRequest {
  companyIds: number[]
  startDate: string
  endDate: string
}

// ─── Response types ───────────────────────────────────────────────────────────

export interface ConsolidationCompany {
  sourceId: number
  name: string
}

export interface ConsolidationReportLine {
  id: string
  code: string
  name: string
  level: number
  sequence: number
  isGroup: boolean
  isSubtotal?: boolean
  isCarry?: boolean
  isFooter?: boolean
  companyBalances: Record<string, number>   // key = company sourceId string
  totalBeforeElim: number
  eliminationDebit: number
  eliminationCredit: number
  totalAfterElim: number
  children?: ConsolidationReportLine[]
}

export interface ConsolidationSummary {
  totalBeforeElimination: number
  totalEliminationDebit: number
  totalEliminationCredit: number
  totalAfterElimination: number
}

export interface ConsolidationReport {
  reportType: string
  period: { startDate: string; endDate: string }
  companies: ConsolidationCompany[]
  lines: ConsolidationReportLine[]
  summary: ConsolidationSummary
}

export interface EliminationEntry {
  id: number
  date: string
  companyName: string
  accountCode: string
  accountName: string
  partnerName?: string
  intercompanyWith?: string
  description: string
  debit: number
  credit: number
}

export interface EliminationResponse {
  period: { startDate: string; endDate: string }
  entries: EliminationEntry[]
  summary: { totalDebit: number; totalCredit: number; entryCount: number }
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const consolidationService = {
  async getReport(req: ConsolidationReportRequest): Promise<ConsolidationReport> {
    const { data } = await apiClient.post<ApiEnvelope<ConsolidationReport>>(
      '/finance/consolidation/report',
      req,
    )
    return data.data
  },

  async getEliminations(req: EliminationEntriesRequest): Promise<EliminationResponse> {
    const { data } = await apiClient.post<ApiEnvelope<EliminationResponse>>(
      '/finance/consolidation/eliminations',
      req,
    )
    return data.data
  },
}
