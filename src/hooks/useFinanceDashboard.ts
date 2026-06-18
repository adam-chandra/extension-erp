import { useQuery } from '@tanstack/react-query'
import {
  financeService,
  type DashboardPeriod,
  type DashboardDateRange,
} from '@/services/finance.service'

export const financeKeys = {
  all: ['finance'] as const,
  dashboard: (companyId: number, period: DashboardPeriod, range?: DashboardDateRange) =>
    [...financeKeys.all, 'dashboard', companyId, period, range?.start ?? '', range?.end ?? ''] as const,
  returns: (companyId: number, limit: number) =>
    [...financeKeys.all, 'returns', companyId, limit] as const,
  returnsByAccount: (
    companyId: number,
    period: DashboardPeriod,
    range?: DashboardDateRange,
    limit?: number,
  ) =>
    [
      ...financeKeys.all,
      'returnsByAccount',
      companyId,
      period,
      range?.start ?? '',
      range?.end ?? '',
      limit ?? 10,
    ] as const,
}

/** Custom periods need a valid start AND end. */
function periodReady(period: DashboardPeriod, range?: DashboardDateRange): boolean {
  if (period !== 'custom') return true
  return !!range?.start && !!range?.end
}

export function useFinanceDashboard(
  companyId: number | null,
  period: DashboardPeriod = 'all',
  range?: DashboardDateRange,
) {
  return useQuery({
    queryKey: financeKeys.dashboard(companyId ?? 0, period, range),
    queryFn: () => financeService.dashboard(companyId!, period, range),
    enabled: !!companyId && companyId > 0 && periodReady(period, range),
    staleTime: 60_000,
  })
}

export function useFinanceReturns(companyId: number | null, limit = 15) {
  return useQuery({
    queryKey: financeKeys.returns(companyId ?? 0, limit),
    queryFn: () => financeService.returns(companyId!, limit),
    enabled: !!companyId && companyId > 0,
    staleTime: 60_000,
  })
}

export function useFinanceReturnsByAccount(
  companyId: number | null,
  period: DashboardPeriod = 'all',
  range?: DashboardDateRange,
  limit = 10,
) {
  return useQuery({
    queryKey: financeKeys.returnsByAccount(companyId ?? 0, period, range, limit),
    queryFn: () => financeService.returnsByAccount(companyId!, period, range, limit),
    enabled: !!companyId && companyId > 0 && periodReady(period, range),
    staleTime: 60_000,
  })
}
