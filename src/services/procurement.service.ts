import { apiClient } from "@/lib/axios";
import type {
  ProcurementFilters,
  ProcurementDashboardResponse,
  PaginatedDocuments,
  MetricType,
  Metric,
  MetricCard,
  TrendDataPoint,
  PurchaseTrendYTDDataPoint,
  ProcurementDashboardData,
} from "@/types/procurement";
import {
  getMockProcurementDashboard,
  getMockPOCycleTimeTrend,
  getMockPurchaseTrendYTD,
  procurementMetricConfig,
} from "@/data/procurement-mock";

interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

function isBlankMetricValue(value: unknown): boolean {
  return value === undefined || value === null || value === "" || value === "-";
}

function mergeMetricWithStyling(
  metric: Metric | undefined,
  config: Omit<MetricCard, keyof Metric>,
): MetricCard {
  return {
    title: metric?.title || "",
    value: isBlankMetricValue(metric?.value) ? 0 : Number(metric?.value),
    unit: metric?.unit || "",
    remarks: metric?.remarks || "",
    ...config,
    module: "procurement",
  };
}

// Merge backend snake_case response with frontend camelCase + styling.
// Field-level fallback keeps the dashboard usable while backend metrics are rolled out incrementally.
function mergeWithStyling(
  response: ProcurementDashboardResponse,
): ProcurementDashboardData {
  return {
    costSaving: mergeMetricWithStyling(
      response.cost_saving,
      procurementMetricConfig.costSaving,
    ),
    savingRate: mergeMetricWithStyling(
      response.saving_rate,
      procurementMetricConfig.savingRate,
    ),
    otdRate: mergeMetricWithStyling(
      response.otd_rate,
      procurementMetricConfig.otdRate,
    ),
    poCycleTime: mergeMetricWithStyling(
      response.po_cycle_time,
      procurementMetricConfig.poCycleTime,
    ),
    prNoPO: mergeMetricWithStyling(
      response.pr_no_po,
      procurementMetricConfig.prNoPO,
    ),
    poIncomplete: mergeMetricWithStyling(
      response.po_incomplete,
      procurementMetricConfig.poIncomplete,
    ),
    poNoReceiving: mergeMetricWithStyling(
      response.po_no_receiving,
      procurementMetricConfig.poNoReceiving,
    ),
    receivingCycleTime: mergeMetricWithStyling(
      response.receiving_cycle_time,
      procurementMetricConfig.receivingCycleTime,
    ),
    procurementCycleTime: mergeMetricWithStyling(
      response.procurement_cycle_time,
      procurementMetricConfig.procurementCycleTime,
    ),
  };
}

function mapFilters(filters?: ProcurementFilters) {
  if (!filters) return {};
  return {
    period: filters.dateFilter,
    start: filters.dateRange?.startDate,
    end: filters.dateRange?.endDate,
    search: filters.search,
  };
}

export const procurementService = {
  async getDashboard(
    companyId: string,
    filters?: ProcurementFilters,
  ): Promise<ProcurementDashboardData> {
    try {
      const { data } = await apiClient.get<
        ApiEnvelope<ProcurementDashboardResponse>
      >("/procurement/dashboard", {
        params: {
          companyId,
          ...mapFilters(filters),
        },
      });
      return mergeWithStyling(data.data);
    } catch (error) {
      console.error("[getDashboard] Error:", error);
      return mergeWithStyling(getMockProcurementDashboard());
    }
  },
  async getPOCycleTimeTrend(
    companyId: string,
    filters?: ProcurementFilters,
  ): Promise<TrendDataPoint[]> {
    try {
      const { data } = await apiClient.get<ApiEnvelope<TrendDataPoint[]>>(
        "/procurement/po-cycle-time-trend",
        {
          params: { companyId, ...mapFilters(filters) },
        },
      );
      return data.data;
    } catch (error) {
      console.error("[getPOCycleTimeTrend] Error:", error);
      return getMockPOCycleTimeTrend();
    }
  },
  async getPurchaseTrendYTD(
    companyId: string,
    filters?: ProcurementFilters,
  ): Promise<PurchaseTrendYTDDataPoint[]> {
    try {
      const { data } = await apiClient.get<
        ApiEnvelope<PurchaseTrendYTDDataPoint[]>
      >("/procurement/purchase-trend-ytd", {
        params: { companyId, ...mapFilters(filters) },
      });
      return data.data;
    } catch (error) {
      console.error("[getPurchaseTrendYTD] Error:", error);
      return getMockPurchaseTrendYTD();
    }
  },
  async getReceivingCycleTimeTrend(
    companyId: string,
    filters?: ProcurementFilters,
  ): Promise<TrendDataPoint[]> {
    try {
      const { data } = await apiClient.get<ApiEnvelope<TrendDataPoint[]>>(
        "/procurement/receiving-cycle-time-trend",
        {
          params: { companyId, ...mapFilters(filters) },
        },
      );
      return data.data;
    } catch (error) {
      console.error("[getReceivingCycleTimeTrend] Error:", error);
      throw error;
    }
  },
  async getProcurementCycleTimeTrend(
    companyId: string,
    filters?: ProcurementFilters,
  ): Promise<TrendDataPoint[]> {
    try {
      const { data } = await apiClient.get<ApiEnvelope<TrendDataPoint[]>>(
        "/procurement/procurement-cycle-time-trend",
        {
          params: { companyId, ...mapFilters(filters) },
        },
      );
      return data.data;
    } catch (error) {
      console.error("[getProcurementCycleTimeTrend] Error:", error);
      throw error;
    }
  },

  async getDocuments(
    companyId: string,
    metric: MetricType,
    page: number,
    limit: number,
    filters?: ProcurementFilters,
  ): Promise<PaginatedDocuments> {
    try {
      const { data } = await apiClient.get<ApiEnvelope<PaginatedDocuments>>(
        "/procurement/documents",
        {
          params: {
            companyId,
            metric,
            page,
            limit,
            ...mapFilters(filters),
          },
        },
      );
      return data.data;
    } catch (error) {
      console.error("[getDocuments] Error:", error);
      throw error;
    }
  },
};
