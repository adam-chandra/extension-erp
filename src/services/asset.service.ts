import { apiClient } from '@/lib/axios'
import type { ApiResponse, AssetDashboardSummary } from "@/types/asset-dashboard";

export const assetService = {
  getDashboardSummary: async (companyId: number) => {
    const { data } = await apiClient.get<ApiResponse<AssetDashboardSummary>>(
      "/asset/dashboard",
      { params: { companyId } }
    );
    return data.data;
  },
};