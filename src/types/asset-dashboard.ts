export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface AssetStatusBreakdown {
  active: number;
  idle: number;
  damage: number;
  missing: number;
}

export interface AssetDashboardSummary {
  companyId: number;
  totalUnitAsset: number;
  totalAssetValue: number;
  status: AssetStatusBreakdown;
}