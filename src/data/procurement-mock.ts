import type {
  ProcurementDashboardResponse,
  TrendDataPoint,
  PurchaseTrendYTDDataPoint,
} from "@/types/procurement";

export function getMockProcurementDashboard(): ProcurementDashboardResponse {
  return {
    company_id: 0,
    cost_saving: { title: "Cost Saving", value: 0, unit: "", remarks: "" },
    saving_rate: { title: "Saving Rate", value: 0, unit: "", remarks: "" },
    otd_rate: { title: "OTD Rate", value: 0, unit: "", remarks: "" },
    po_cycle_time: { title: "PO Cycle Time", value: 0, unit: "", remarks: "" },
    pr_no_po: { title: "PR No PO", value: 0, unit: "", remarks: "" },
    po_incomplete: { title: "PO Incomplete", value: 0, unit: "", remarks: "" },
    po_no_receiving: { title: "PO No Receiving", value: 0, unit: "", remarks: "" },
    receiving_cycle_time: { title: "Receiving Cycle Time", value: 0, unit: "", remarks: "" },
    procurement_cycle_time: { title: "Procurement Cycle Time", value: 0, unit: "", remarks: "" },
  };
}

export function getMockPOCycleTimeTrend(): TrendDataPoint[] {
  return [
    { label: "Jan", value: 0 },
    { label: "Feb", value: 0 },
    { label: "Mar", value: 0 },
  ];
}

export function getMockPurchaseTrendYTD(): PurchaseTrendYTDDataPoint[] {
  return [
    { label: "Jan", ytd_this_year: 0, ytd_last_year: 0 },
  ];
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
  prNoPO: {
    icon: "FileText",
    iconBgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
    cardId: "proc-tile-pr-no-po",
  },
  poIncomplete: {
    icon: "ShoppingCart",
    iconBgColor: "bg-amber-100",
    iconColor: "text-amber-600",
    cardId: "proc-tile-po-incomplete",
  },
  poNoReceiving: {
    icon: "Package",
    iconBgColor: "bg-sky-100",
    iconColor: "text-sky-600",
    cardId: "proc-tile-po-no-receiving",
  },
  receivingCycleTime: {
    icon: "Clock",
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600",
    cardId: "proc-tile-receiving-cycle-time",
  },
  procurementCycleTime: {
    icon: "Clock",
    iconBgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
    cardId: "proc-tile-procurement-cycle-time",
  },
};
