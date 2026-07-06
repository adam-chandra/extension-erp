import { useState } from "react";
import {
  Building,
  Package,
  TrendingUp,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { TileCard } from "@/components/common/TileCard";
import { SingleSeriesLineChartCard } from "@/components/common/SingleSeriesLineChartCard";
import { MultiSeriesLineChartCard } from "@/components/common/MultiSeriesLineChartCard";
import { DateFilterDropdown } from "@/components/common/DateFilterDropdown";
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from "@/components/common/withWorkspaceLayout";
import { useProcurementDashboard, usePOCycleTimeTrend, usePurchaseTrendYTD } from "@/hooks/useProcurementDashboard";
import type { DateFilterOption } from "@/types/procurement";

// Map icon names to components
const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  ShoppingCart,
  Package,
};

function ProcurementDashboardContent({
  selectedCompany,
}: WorkspaceLayoutInjectedProps & { selectedCompany?: string }) {
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("all");
  const [customRange, setCustomRange] = useState<{ startDate: string; endDate: string } | undefined>(undefined);

  const filters = {
    dateFilter,
    dateRange: dateFilter === "custom" ? customRange : undefined,
    companyId: selectedCompany ?? "",
  };

  // Fetch dashboard data
  const { data, isLoading, error } = useProcurementDashboard(selectedCompany ?? null, filters);

  // Fetch PO Cycle Time trend data
  const { data: cycleTimeTrend, isLoading: isCycleTimeLoading } = usePOCycleTimeTrend(selectedCompany ?? null, filters);

  // Fetch Purchase Trend YTD data
  const { data: purchaseTrendYTD, isLoading: isPurchaseTrendLoading } = usePurchaseTrendYTD(selectedCompany ?? null, filters);

  if (!selectedCompany) {
    return (
      <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Building className="mx-auto h-16 w-16 text-slate-300" />
          <h2 className="text-2xl font-semibold text-slate-700">
            Silakan pilih company
          </h2>
          <p className="text-slate-500">
            Pilih company dari sidebar untuk menampilkan dashboard
          </p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin inline-flex h-12 w-12 rounded-full border-4 border-slate-300 border-t-primary" />
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Building className="mx-auto h-16 w-16 text-red-300" />
          <h2 className="text-2xl font-semibold text-slate-700">
            Error loading dashboard
          </h2>
          <p className="text-slate-500">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          DASHBOARD PROCUREMENT
        </h1>
        <DateFilterDropdown
          value={dateFilter}
          onChange={(v, start, end) => {
            setDateFilter(v);
            if (v === "custom" && start && end) {
              setCustomRange({ startDate: start, endDate: end });
            }
          }}
        />
      </div>

      {/* Row 1 — 4 KPI tiles */}
      {data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
          {Object.values(data).map((metric) => (
            <TileCard
              key={metric.cardId}
              title={metric.title}
              value={metric.value}
              unit={metric.unit}
              remarks={metric.remarks}
              icon={iconMap[metric.icon] || TrendingUp}
              iconBgColor={metric.iconBgColor}
              iconColor={metric.iconColor}
              cardId={metric.cardId}
              module={metric.module}
            />
          ))}
        </div>
      )}
      {/* Row 2 — Average PO Cycle Time by Month */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 mb-6">
        {isCycleTimeLoading ? (
          <div className="rounded-2xl bg-white px-5 py-8 shadow-md flex items-center justify-center min-h-[300px]">
            <div className="text-center space-y-3">
              <div className="animate-spin inline-flex h-8 w-8 rounded-full border-4 border-slate-300 border-t-primary" />
              <p className="text-sm text-slate-500">Loading chart...</p>
            </div>
          </div>
        ) : cycleTimeTrend && cycleTimeTrend.length > 0 ? (
          <SingleSeriesLineChartCard
            title="Average PO Cycle Time by Month"
            remarks="Rata-rata waktu dari PR (selesai) hingga PO diselesaikan"
            seriesLabel="Actual"
            color="#3b82f6"
            unit=" hari"
            data={cycleTimeTrend}
            targetValue={5.0}
            targetLabel="Target (≤ 5.0 hari)"
            showDataLabels
            cardId="proc-chart-po-cycle-time-trend"
            module="procurement"
          />
        ) : null}
      </div>

      {/* Row 3 — Trend Nilai Pembelian Year To Date */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 mb-6">
        {isPurchaseTrendLoading ? (
          <div className="rounded-2xl bg-white px-5 py-8 shadow-md flex items-center justify-center min-h-[300px]">
            <div className="text-center space-y-3">
              <div className="animate-spin inline-flex h-8 w-8 rounded-full border-4 border-slate-300 border-t-primary" />
              <p className="text-sm text-slate-500">Loading chart...</p>
            </div>
          </div>
        ) : purchaseTrendYTD && purchaseTrendYTD.length > 0 ? (
          <MultiSeriesLineChartCard
            title="Trend Nilai Pembelian Year To Date"
            remarks="Perbandingan Akumulasi Pembelian (Before Tax) Tahun Ini vs. Tahun Sebelumnya"
            yAxisLabel="Nilai Pembelian (Rp)"
            tooltipUnit="M"
            yAxisFormatter={(v) => `${v.toFixed(1)}M`}
            series={[
              { key: "ytd_this_year", label: "YTD Tahun Ini", color: "#3b82f6" },
              { key: "ytd_last_year", label: "YTD Tahun Lalu", color: "#9ca3af", dashed: true },
            ]}
            data={purchaseTrendYTD}
            showDataLabels
            cardId="proc-chart-purchase-trend-ytd"
            module="procurement"
          />
        ) : null}
      </div>
    </section>
  );
}

export const ProcurementDashboardPage = withWorkspaceLayout(
  ProcurementDashboardContent,
);
