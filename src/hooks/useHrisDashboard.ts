import { useQuery } from '@tanstack/react-query'
import { hrisService } from '@/services/hris.service'

export const hrisKeys = {
  all: ['hris'] as const,
  dashboard: (companyId: number) => [...hrisKeys.all, 'dashboard', companyId] as const,
}

export function useHrisDashboard(companyId: number | null) {
  return useQuery({
    queryKey: hrisKeys.dashboard(companyId ?? 0),
    queryFn: () => hrisService.dashboard(companyId!),
    enabled: !!companyId && companyId > 0,
    staleTime: 60_000,
  })
}
