import { useQuery } from '@tanstack/react-query'
import { hrisService } from '@/services/hris.service'

export const hrisKeys = {
  all: ['hris'] as const,
  dashboard: (companyId: number, year: number) =>
    [...hrisKeys.all, 'dashboard', companyId, year] as const,
}

export function useHrisDashboard(companyId: number | null, year: number) {
  return useQuery({
    queryKey: hrisKeys.dashboard(companyId ?? 0, year),
    queryFn: () => hrisService.dashboard(companyId!, year),
    enabled: !!companyId && companyId > 0,
    staleTime: 60_000,
  })
}
