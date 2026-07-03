import type { KpiColor, KpiTrend } from "@/components/common/SummaryCard";

export interface AssetKpiItem {
  label: string;
  value: number | string;
  unit?: string;
  color: KpiColor;
  icon: "box" | "wallet" | "monitor" | "hourglass" | "wrench" | "search";
  trend?: KpiTrend;
}

export interface AssetDonutItem {
  label: string;
  value: number;
  color: string;
  note?: string;
  percentageLabel?: string;
}

export interface AssetCategoryRow {
  category: string;
  unit: number;
  value: number;
  isRounded?: boolean;
  percentageLabel: string;
  color: string;
}

export interface AssetProgressItem {
  label: string;
  progress: number;
  colorClass: string;
}

export interface AssetStatBox {
  title: string;
  value: string;
  subtitle: string;
  icon:
    | "fileText"
    | "alertTriangle"
    | "search"
    | "hourglass"
    | "trash"
    | "refreshCw";
  tone: "slate" | "blue" | "amber" | "rose" | "emerald";
  progress?: number;
}

export interface AssetDepartmentItem {
  label: string;
  valueLabel: string;
}

export interface AssetDashboardData {
  title: string;
  kpis: AssetKpiItem[];
  location: {
    filterLabel: string;
    totalLabel: string;
    donut: AssetDonutItem[];
    topOfficeBars: { name: string; value: number }[];
  };
  category: {
    filterLabel: string;
    totalLabel: string;
    donut: AssetDonutItem[];
    rows: AssetCategoryRow[];
    totalUnitLabel: string;
    totalValue: number;
    totalValueIsRounded?: boolean;
  };
  ownership: {
    totalOwnersLabel: string;
    assignedPercentLabel: string;
    assignedProgress: number;
    departments: AssetDepartmentItem[];
  };
  audit: {
    cards: AssetStatBox[];
  };
  progressArea: AssetProgressItem[];
  lifecycle: {
    totalLabel: string;
    donut: AssetDonutItem[];
    averageAgeLabel: string;
    averageAgeSubLabel: string;
  };
  idleDisposal: AssetStatBox[];
}

const COMPANY_1_DATA: AssetDashboardData = {
  title: "DASHBOARD ASSET",
  kpis: [
    {
      label: "Total Asset",
      value: 12458,
      unit: "unit",
      color: "blue",
      icon: "box",
      trend: { value: "5,2%", direction: "up", caption: "vs Des 2025" },
    },
    {
      label: "Total Asset Value",
      value: 48750000000,
      unit: "unit",
      color: "emerald",
      icon: "wallet",
      trend: { value: "6,8%", direction: "up", caption: "vs Des 2025" },
    },
    {
      label: "Active Asset",
      value: 10215,
      unit: "unit",
      color: "teal",
      icon: "monitor",
      trend: { value: "82,1%", direction: "up", caption: "dari total aset" },
    },
    {
      label: "Idle Asset",
      value: 1276,
      unit: "unit",
      color: "amber",
      icon: "hourglass",
      trend: { value: "10,2%", direction: "down", caption: "dari total aset" },
    },
    {
      label: "Damaged Asset",
      value: 642,
      unit: "unit",
      color: "rose",
      icon: "wrench",
      trend: { value: "5,1%", direction: "down", caption: "dari total aset" },
    },
    {
      label: "Missing Asset",
      value: 325,
      unit: "unit",
      color: "purple",
      icon: "search",
      trend: { value: "2,6%", direction: "down", caption: "dari total aset" },
    },
  ],
  location: {
    filterLabel: "Semua Area",
    totalLabel: "12.458",
    donut: [
      {
        label: "Cilacap",
        value: 7709,
        color: "#2563eb",
        note: "(18 Kantor)",
        percentageLabel: "62%",
      },
      {
        label: "Purwokerto",
        value: 2616,
        color: "#10b981",
        note: "(6 Kantor)",
        percentageLabel: "21%",
      },
      {
        label: "Jakarta",
        value: 1245,
        color: "#f59e0b",
        note: "(2 Kantor)",
        percentageLabel: "10%",
      },
      {
        label: "Lainnya",
        value: 888,
        color: "#8b5cf6",
        percentageLabel: "7%",
      },
    ],
    topOfficeBars: [
      { name: "Cilacap ", value: 1250 },
      { name: "Purwokerto", value: 980 },
      { name: "Jakarta", value: 870 },
      { name: "Surabaya", value: 760 },
      { name: "Yogyakarta", value: 650 },
    ],
  },
  category: {
    filterLabel: "Semua Kategori",
    totalLabel: "12.458",
    donut: [
      { label: "Laptop", value: 4560, color: "#2563eb", percentageLabel: "36,6%" },
      { label: "Handphone", value: 3125, color: "#10b981", percentageLabel: "25,1%" },
      { label: "PC", value: 2340, color: "#f59e0b", percentageLabel: "18,8%" },
      { label: "Monitor", value: 1520, color: "#f97316", percentageLabel: "12,2%" },
      { label: "Lainnya", value: 913, color: "#ef4444", percentageLabel: "7,3%" },
    ],
    rows: [
      { category: "Laptop", unit: 4560, value: 18450000000, isRounded: true, percentageLabel: "36,6%", color: "#2563eb" },
      { category: "Handphone", unit: 3125, value: 12100000000, isRounded: true, percentageLabel: "25,1%", color: "#10b981" },
      { category: "PC", unit: 2340, value: 8350000000, isRounded: true, percentageLabel: "18,8%", color: "#f59e0b" },
      { category: "Monitor", unit: 1520, value: 5200000000, isRounded: true, percentageLabel: "12,2%", color: "#f97316" },
    ],
    totalUnitLabel: "12.458",
    totalValue: 48750000000,
    totalValueIsRounded: true,
  },
  ownership: {
    totalOwnersLabel: "1.500",
    assignedPercentLabel: "98,3%",
    assignedProgress: 98,
    departments: [
      { label: "Sales & Marketing", valueLabel: "3.245 (26,0%)" },
      { label: "Operations", valueLabel: "2.890 (23,2%)" },
      { label: "Finance", valueLabel: "1.650 (13,2%)" },
      { label: "HR & GA", valueLabel: "1.420 (11,4%)" },
    ],
  },
  audit: {
    cards: [
      {
        title: "Aset Progress",
        value: "67%",
        subtitle: "Selesai",
        icon: "fileText",
        tone: "blue",
        progress: 67,
      },
      {
        title: "Aset Checked",
        value: "8.345",
        subtitle: "unit",
        icon: "fileText",
        tone: "slate",
      },
      {
        title: "Aset Mismatch",
        value: "236",
        subtitle: "unit",
        icon: "alertTriangle",
        tone: "amber",
      },
      {
        title: "Missing Asset",
        value: "85",
        subtitle: "Unit",
        icon: "search",
        tone: "rose",
      },
    ],
  },
  progressArea: [
    { label: "Cilacap", progress: 72, colorClass: "bg-blue-600" },
    { label: "Purwokerto", progress: 61, colorClass: "bg-emerald-500" },
    { label: "Jakarta", progress: 75, colorClass: "bg-amber-500" },
  ],
  lifecycle: {
    totalLabel: "12.458",
    donut: [
      { label: "0 - 2 Tahun", value: 4125, color: "#10b981", percentageLabel: "33,1%" },
      { label: "3 - 5 Tahun", value: 4560, color: "#2563eb", percentageLabel: "36,6%" },
      { label: "6 - 8 Tahun", value: 2345, color: "#f59e0b", percentageLabel: "18,8%" },
      { label: "> 8 Tahun", value: 1428, color: "#ef4444", percentageLabel: "11,5%" },
    ],
    averageAgeLabel: "3,8 Tahun",
    averageAgeSubLabel: "Umur aset perusahaan saat ini",
  },
  idleDisposal: [
    {
      title: "Idle Asset",
      value: "1.276",
      subtitle: "unit",
      icon: "hourglass",
      tone: "amber",
    },
    {
      title: "Disposal Candidate",
      value: "642",
      subtitle: "unit",
      icon: "trash",
      tone: "rose",
    },
    {
      title: "Aset Reallocated (2026)",
      value: "215",
      subtitle: "unit",
      icon: "refreshCw",
      tone: "emerald",
    },
  ],
};

export function getAssetDashboardData(_companyId: number): AssetDashboardData {
  return COMPANY_1_DATA;
}
