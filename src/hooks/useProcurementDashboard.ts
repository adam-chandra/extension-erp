import { useQuery } from "@tanstack/react-query";
import { procurementService } from "@/services/procurement.service";
import type { ProcurementFilters, MetricType } from "@/types/procurement";

// Query key factory
export const procurementKeys = {
  all: ["procurement"] as const,
  dashboard: (companyId: string, filters?: ProcurementFilters) =>
    [...procurementKeys.all, "dashboard", companyId, filters] as const,
  poCycleTimeTrend: (companyId: string, filters?: ProcurementFilters) =>
    [
      ...procurementKeys.all,
      "po-cycle-time-trend",
      companyId,
      filters,
    ] as const,
  purchaseTrendYTD: (companyId: string, filters?: ProcurementFilters) =>
    [...procurementKeys.all, "purchase-trend-ytd", companyId, filters] as const,
  receivingCycleTimeTrend: (companyId: string, filters?: ProcurementFilters) =>
    [
      ...procurementKeys.all,
      "receiving-cycle-time-trend",
      companyId,
      filters,
    ] as const,
  procurementCycleTimeTrend: (
    companyId: string,
    filters?: ProcurementFilters,
  ) =>
    [
      ...procurementKeys.all,
      "procurement-cycle-time-trend",
      companyId,
      filters,
    ] as const,
  documents: (
    companyId: string,
    metric: MetricType,
    page: number,
    limit: number,
    filters?: ProcurementFilters,
  ) =>
    [
      ...procurementKeys.all,
      "documents",
      companyId,
      metric,
      page,
      limit,
      filters,
    ] as const,
};

// Hook untuk fetch dashboard
export function useProcurementDashboard(
  companyId: string | null,
  filters?: ProcurementFilters,
) {
  return useQuery({
    queryKey: procurementKeys.dashboard(companyId ?? "", filters),
    queryFn: async () => {
      try {
        const result = await procurementService.getDashboard(
          companyId!,
          filters,
        );
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
export function usePOCycleTimeTrend(
  companyId: string | null,
  filters?: ProcurementFilters,
) {
  return useQuery({
    queryKey: procurementKeys.poCycleTimeTrend(companyId ?? "", filters),
    queryFn: () => procurementService.getPOCycleTimeTrend(companyId!, filters),
    enabled: !!companyId,
    staleTime: 60_000,
  });
}

// Hook untuk fetch Purchase Trend YTD
export function usePurchaseTrendYTD(
  companyId: string | null,
  filters?: ProcurementFilters,
) {
  return useQuery({
    queryKey: procurementKeys.purchaseTrendYTD(companyId ?? "", filters),
    queryFn: () => procurementService.getPurchaseTrendYTD(companyId!, filters),
    enabled: !!companyId,
    staleTime: 60_000,
  });
}

// Hook untuk fetch Receiving Cycle Time trend
export function useReceivingCycleTimeTrend(
  companyId: string | null,
  filters?: ProcurementFilters,
) {
  return useQuery({
    queryKey: procurementKeys.receivingCycleTimeTrend(companyId ?? "", filters),
    queryFn: () =>
      procurementService.getReceivingCycleTimeTrend(companyId!, filters),
    enabled: !!companyId,
    staleTime: 60_000,
  });
}

// Hook untuk fetch Procurement Cycle Time trend
export function useProcurementCycleTimeTrend(
  companyId: string | null,
  filters?: ProcurementFilters,
) {
  return useQuery({
    queryKey: procurementKeys.procurementCycleTimeTrend(
      companyId ?? "",
      filters,
    ),
    queryFn: () =>
      procurementService.getProcurementCycleTimeTrend(companyId!, filters),
    enabled: !!companyId,
    staleTime: 60_000,
  });
}

// Hook untuk fetch paginated documents (PR / PO list)
export function useProcurementDocuments(
  companyId: string | null,
  metric: MetricType,
  page: number,
  limit: number,
  filters?: ProcurementFilters,
) {
  return useQuery({
    queryKey: procurementKeys.documents(
      companyId ?? "",
      metric,
      page,
      limit,
      filters,
    ),
    queryFn: () =>
      procurementService.getDocuments(companyId!, metric, page, limit, filters),
    enabled: !!companyId && !!metric,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}
