import { apiClient } from "@/lib/axios";
import type {
  ProcurementFilters,
  ProcurementDashboardResponse,
  MetricCard,
} from "@/types/procurement";
import {
  getMockProcurementDashboard,
  getMockPOCycleTimeTrend,
  getMockPurchaseTrendYTD,
  procurementMetricConfig,
  type PurchaseTrendYTDDataPoint,
  type TrendDataPoint,
} from "@/data/procurement-mock";

interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

// Frontend UI model - with styling applied
export interface ProcurementDashboardData {
  costSaving: MetricCard;
  savingRate: MetricCard;
  otdRate: MetricCard;
  poCycleTime: MetricCard;
}

// Merge backend snake_case response with frontend camelCase + styling
function mergeWithStyling(
  response: ProcurementDashboardResponse,
): ProcurementDashboardData {
  return {
    costSaving: {
      ...response.cost_saving,
      ...procurementMetricConfig.costSaving,
    },
    savingRate: {
      ...response.saving_rate,
      ...procurementMetricConfig.savingRate,
    },
    otdRate: {
      ...response.otd_rate,
      ...procurementMetricConfig.otdRate,
    },
    poCycleTime: {
      ...response.po_cycle_time,
      ...procurementMetricConfig.poCycleTime,
    },
  };
}

function mapFilters(filters?: ProcurementFilters) {
  if (!filters) return {};
  return {
    period: filters.dateFilter,
    start: filters.dateRange?.startDate,
    end: filters.dateRange?.endDate,
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
    } catch {
      const mockData = getMockProcurementDashboard();
      return mergeWithStyling(mockData);
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
    } catch {
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
    } catch {
      return getMockPurchaseTrendYTD();
    }
  },
};
