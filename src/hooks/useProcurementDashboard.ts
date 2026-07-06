import { useQuery } from '@tanstack/react-query';
import { procurementService } from '@/services/procurement.service';
import type { ProcurementFilters } from '@/types/procurement';

// Query key factory
export const procurementKeys = {
  all: ['procurement'] as const,
  dashboard: (companyId: string, filters?: ProcurementFilters) =>
    [...procurementKeys.all, 'dashboard', companyId, filters] as const,
  poCycleTimeTrend: (companyId: string, filters?: ProcurementFilters) =>
    [...procurementKeys.all, 'po-cycle-time-trend', companyId, filters] as const,
  purchaseTrendYTD: (companyId: string, filters?: ProcurementFilters) =>
    [...procurementKeys.all, 'purchase-trend-ytd', companyId, filters] as const,
};

// Hook untuk fetch dashboard
export function useProcurementDashboard(
  companyId: string | null,
  filters?: ProcurementFilters
) {
  return useQuery({
    queryKey: procurementKeys.dashboard(companyId ?? '', filters),
    queryFn: async () => {
      try {
        const result = await procurementService.getDashboard(companyId!, filters);
        return result;
      } catch (error) {
        console.error("[useProcurementDashboard] QueryFn ERROR:", error);
        throw error;
      }
    },
    enabled: !!companyId,
    staleTime: 60_000,
  });
}

// Hook untuk fetch PO Cycle Time trend
export function usePOCycleTimeTrend(companyId: string | null, filters?: ProcurementFilters) {
  return useQuery({
    queryKey: procurementKeys.poCycleTimeTrend(companyId ?? '', filters),
    queryFn: () => procurementService.getPOCycleTimeTrend(companyId!, filters),
    enabled: !!companyId,
    staleTime: 60_000,
  });
}

// Hook untuk fetch Purchase Trend YTD
export function usePurchaseTrendYTD(companyId: string | null, filters?: ProcurementFilters) {
  return useQuery({
    queryKey: procurementKeys.purchaseTrendYTD(companyId ?? '', filters),
    queryFn: () => procurementService.getPurchaseTrendYTD(companyId!, filters),
    enabled: !!companyId,
    staleTime: 60_000,
  });
}