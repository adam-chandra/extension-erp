import type { ProcurementDashboardResponse } from "@/types/procurement";

export interface TrendDataPoint {
  label: string;
  value: number;
}

export interface PurchaseTrendYTDDataPoint {
  label: string;
  ytd_this_year: number;
  ytd_last_year: number;
  [key: string]: number | string;
}

// Minimal fallback mock, hanya dipakai jika backend tidak tersedia
const fallbackDashboard: ProcurementDashboardResponse = {
  company_id: 0,
  cost_saving: {
    title: "Cost Saving",
    value: 0,
    unit: "Rp. Million (Juta)",
    remarks: "Nilai ekonomis hasil negosiasi PR vs PO",
  },
  saving_rate: {
    title: "% Saving",
    value: 0,
    unit: "% Saving Rate",
    remarks: "Persentase saving hasil negosiasi PR vs PO",
  },
  otd_rate: {
    title: "On-Time Delivery Rate (OTD)",
    value: 0,
    unit: "% OTD Rate",
    remarks: "Persentase penerimaan tepat waktu",
  },
  po_cycle_time: {
    title: "Average PO Cycle Time",
    value: 0,
    unit: "Hari",
    remarks: "Rata-rata waktu siklus Purchase Order",
  },
};

export function getMockProcurementDashboard(): ProcurementDashboardResponse {
  return fallbackDashboard;
}

export const procurementMetricConfig = {
  costSaving: {
    icon: "TrendingUp",
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600",
    cardId: "proc-tile-cost-saving",
  },
  savingRate: {
    icon: "TrendingUp",
    iconBgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
    cardId: "proc-tile-saving-rate",
  },
  otdRate: {
    icon: "ShoppingCart",
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    cardId: "proc-tile-otd-rate",
  },
  poCycleTime: {
    icon: "Package",
    iconBgColor: "bg-amber-100",
    iconColor: "text-amber-600",
    cardId: "proc-tile-po-cycle-time",
  },
};

export function getMockPOCycleTimeTrend(): TrendDataPoint[] {
  return [];
}

export function getMockPurchaseTrendYTD(): PurchaseTrendYTDDataPoint[] {
  return [];
}
