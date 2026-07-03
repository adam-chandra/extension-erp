import { useQuery } from "@tanstack/react-query";
import { assetService } from "@/services/asset.service";

export function useAssetDashboard(companyId: number) {
  return useQuery({
    queryKey: ["asset-dashboard-summary", companyId],
    queryFn: () => assetService.getDashboardSummary(companyId),
    enabled: !!companyId,
  });
}