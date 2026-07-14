import { useState, useCallback, type ReactNode } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import {
  Building,
  Package,
  TrendingUp,
  ShoppingCart,
  FileText,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { TileCard } from "@/components/common/TileCard";
import { SingleSeriesLineChartCard } from "@/components/common/SingleSeriesLineChartCard";
import { MultiSeriesLineChartCard } from "@/components/common/MultiSeriesLineChartCard";
import { ProcurementFlowCard } from "@/components/common/ProcurementFlowCard";
import { DateFilterDropdown } from "@/components/common/DateFilterDropdown";
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from "@/components/common/withWorkspaceLayout";

import {
  useProcurementDashboard,
  usePOCycleTimeTrend,
  usePurchaseTrendYTD,
  useReceivingCycleTimeTrend,
  useProcurementCycleTimeTrend,
} from "@/hooks/useProcurementDashboard";
import { ROUTES } from "@/config/routes";
import type { DateFilterOption, MetricCard, TrendDataPoint, PurchaseTrendYTDDataPoint } from "@/types/procurement";

function handleTileClick(navigate: NavigateFunction, metric: MetricCard) {
  navigate(
    `${ROUTES.PROCUREMENT_DETAIL}?metric=${encodeURIComponent(metric.cardId)}`,
  );
}

// Map icon names to components
const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  ShoppingCart,
  Package,
  FileText,
  Clock,
};

function SectionHeader({
  title,
  accentClassName,
}: Readonly<{
  title: string;
  accentClassName: string;
}>) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`h-5 w-1.5 rounded-full ${accentClassName}`} />
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 sm:text-sm">
        {title}
      </h2>
    </div>
  );
}

function ChartLoadingCard() {
  return (
    <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200/70 bg-white px-5 py-8 shadow-sm">
      <div className="text-center">
        <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
        <p className="mt-3 text-sm font-medium text-slate-500">
          Loading chart...
        </p>
      </div>
    </div>
  );
}

function resolveChart(isLoading: boolean, content: ReactNode): ReactNode {
  return isLoading ? <ChartLoadingCard /> : content;
}

type ProcurementChartsSectionProps = Readonly<{
  cycleTimeTrend: TrendDataPoint[] | undefined;
  isCycleTimeLoading: boolean;
  receivingCycleTimeTrend: TrendDataPoint[] | undefined;
  isReceivingCycleTimeLoading: boolean;
  procurementCycleTimeTrend: TrendDataPoint[] | undefined;
  isProcurementCycleTimeLoading: boolean;
  purchaseTrendYTD: PurchaseTrendYTDDataPoint[] | undefined;
  isPurchaseTrendLoading: boolean;
}>;

function ProcurementChartsSection({
  cycleTimeTrend,
  isCycleTimeLoading,
  receivingCycleTimeTrend,
  isReceivingCycleTimeLoading,
  procurementCycleTimeTrend,
  isProcurementCycleTimeLoading,
  purchaseTrendYTD,
  isPurchaseTrendLoading,
}: ProcurementChartsSectionProps) {
  const cycleTimeChart = resolveChart(
    isCycleTimeLoading,
    cycleTimeTrend && cycleTimeTrend.length > 0
      ? (
          <SingleSeriesLineChartCard
            title="Average PO Cycle Time by Month"
            remarks="Rata-rata waktu dari PR (selesai) hingga PO diselesaikan"
            seriesLabel="Actual"
            color="#3b82f6"
            yAxisLabel="Waktu (hari)"
            unit=" hari"
            data={cycleTimeTrend}
            targetValue={6.0}
            targetLabel="Target (<= 6.0 hari)"
            showDataLabels
            yAxisTickInterval={2}
            cardId="proc-chart-po-cycle-time-trend"
            module="procurement"
          />
        )
      : null,
  );

  const receivingCycleTimeChart = resolveChart(
    isReceivingCycleTimeLoading,
    receivingCycleTimeTrend && receivingCycleTimeTrend.length > 0
      ? (
          <SingleSeriesLineChartCard
            title="Average RN Cycle Time by Month"
            remarks="Rata-rata waktu dari PO diterbitkan hingga barang diterima"
            seriesLabel="Actual"
            color="#3b82f6"
            yAxisLabel="Waktu (hari)"
            unit=" hari"
            data={receivingCycleTimeTrend}
            targetValue={8.0}
            targetLabel="Target (<= 8.0 hari)"
            showDataLabels
            yAxisTickInterval={2}
            cardId="proc-chart-receiving-cycle-time-trend"
            module="procurement"
          />
        )
      : null,
  );

  const procurementCycleTimeChart = resolveChart(
    isProcurementCycleTimeLoading,
    procurementCycleTimeTrend && procurementCycleTimeTrend.length > 0
      ? (
          <SingleSeriesLineChartCard
            title="Average Procurement Cycle Time by Month"
            remarks="Rata-rata waktu pengadaan dari PR difinalisasi s/d barang/jasa diterima"
            seriesLabel="Actual"
            color="#3b82f6"
            yAxisLabel="Waktu (hari)"
            unit=" hari"
            data={procurementCycleTimeTrend}
            targetValue={14.0}
            targetLabel="Target (<= 14.0 hari)"
            showDataLabels
            yAxisTickInterval={2}
            cardId="proc-chart-procurement-cycle-time-trend"
            module="procurement"
          />
        )
      : null,
  );

  const purchaseTrendChart = resolveChart(
    isPurchaseTrendLoading,
    purchaseTrendYTD && purchaseTrendYTD.length > 0
      ? (
          <MultiSeriesLineChartCard
            title="Trend Nilai Pembelian Year To Date"
            remarks="Perbandingan Akumulasi Pembelian (Before Tax) Tahun Ini vs. Tahun Sebelumnya"
            yAxisLabel="Nilai (Rp Miliar)"
            tooltipUnit="M"
            yAxisFormatter={(v) => (v === 0 ? "0" : `${Number(v.toFixed(1))}M`)}
            series={[
              { key: "ytd_this_year", label: "YTD Tahun Ini", color: "#3b82f6" },
              { key: "ytd_last_year", label: "YTD Tahun Lalu", color: "#9ca3af", dashed: true },
            ]}
            data={purchaseTrendYTD}
            showDataLabels
            cardId="proc-chart-purchase-trend-ytd"
            module="procurement"
          />
        )
      : null,
  );

  return (
    <>
      {/* Row 4: PO Cycle Time + RN Cycle Time Charts */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {cycleTimeChart}
        {receivingCycleTimeChart}
      </div>
      {/* Row 5: Procurement Cycle Time Trend + Purchase Trend YTD */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {procurementCycleTimeChart}
        {purchaseTrendChart}
      </div>
    </>
  );
}

function ProcurementDashboardContent({
  selectedCompany,
}: WorkspaceLayoutInjectedProps & { selectedCompany?: string }) {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("all");
  const [customRange, setCustomRange] = useState<
    { startDate: string; endDate: string } | undefined
  >(undefined);

  const handleDateFilterChange = useCallback(
    (v: DateFilterOption, start?: string, end?: string) => {
      setDateFilter(v);
      if (v === "custom" && start && end) {
        setCustomRange({ startDate: start, endDate: end });
      }
    },
    [],
  );

  const filters = {
    dateFilter,
    dateRange: dateFilter === "custom" ? customRange : undefined,
    companyId: selectedCompany ?? "",
  };

  // Fetch dashboard data
  const { data, isLoading, error } = useProcurementDashboard(
    selectedCompany ?? null,
    filters,
  );

  // Fetch PO Cycle Time trend data
  const { data: cycleTimeTrend, isLoading: isCycleTimeLoading } =
    usePOCycleTimeTrend(selectedCompany ?? null, filters);

  // Fetch Purchase Trend YTD data
  const { data: purchaseTrendYTD, isLoading: isPurchaseTrendLoading } =
    usePurchaseTrendYTD(selectedCompany ?? null, filters);

  // Fetch Receiving Cycle Time trend data
  const {
    data: receivingCycleTimeTrend,
    isLoading: isReceivingCycleTimeLoading,
  } = useReceivingCycleTimeTrend(selectedCompany ?? null, filters);

  // Fetch Procurement Cycle Time trend data
  const {
    data: procurementCycleTimeTrend,
    isLoading: isProcurementCycleTimeLoading,
  } = useProcurementCycleTimeTrend(selectedCompany ?? null, filters);
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

  if (error || !data) {
    return (
      <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Building className="mx-auto h-16 w-16 text-red-300" />
          <h2 className="text-2xl font-semibold text-slate-700">
            Error loading dashboard
          </h2>
          <p className="text-slate-500">
            {error instanceof Error ? error.message : "Dashboard data kosong"}
          </p>
        </div>
      </section>
    );
  }

  const dashboardData = data;

  const performanceKpis = [
    dashboardData.costSaving,
    dashboardData.savingRate,
    dashboardData.otdRate,
  ];

  const operationalPipeline = [
    dashboardData.prNoPO,
    dashboardData.poIncomplete,
    dashboardData.poNoReceiving,
  ];

  // Extracted chart content to avoid nested ternaries
  return (
    <section className="min-h-screen flex-1 bg-slate-50/60 px-4 py-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-370">
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-200/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard Procurement
            </h1>
            <p className="mt-1 max-w-2xl text-sm font-medium text-slate-500">
              Pantau efisiensi saving, outstanding dokumen, dan waktu siklus
              pengadaan dari PR sampai receiving.
            </p>
          </div>
          <DateFilterDropdown
            value={dateFilter}
            onChange={handleDateFilterChange}
          />
        </div>

        <div className="mb-6 space-y-3">
            <SectionHeader
              title="KINERJA & NILAI TAMBAH (PERFORMANCE KPIS)"
              accentClassName="bg-indigo-500"
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {performanceKpis.map((metric) => (
                <TileCard
                  key={metric.cardId}
                  title={metric.title}
                  value={metric.value != null ? metric.value.toString() : "-"}
                  unit={metric.unit}
                  remarks={metric.remarks}
                  icon={iconMap[metric.icon] || TrendingUp}
                  iconBgColor={metric.iconBgColor}
                  iconColor={metric.iconColor}
                  cardId={metric.cardId}
                  module={metric.module}
                  onClick={() => handleTileClick(navigate, metric)}
                />
              ))}
            </div>
          </div>

        <div className="mb-6 space-y-3">
            <SectionHeader
              title="OUTSTANDING & ALUR KERJA (OPERATIONAL PIPELINE)"
              accentClassName="bg-amber-500"
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {operationalPipeline.map((metric) => (
                <TileCard
                  key={metric.cardId}
                  title={metric.title}
                  value={metric.value != null ? metric.value.toString() : "-"}
                  unit={metric.unit}
                  remarks={metric.remarks}
                  icon={iconMap[metric.icon] || Clock}
                  cardId={metric.cardId}
                  module={metric.module}
                  onClick={() => handleTileClick(navigate, metric)}
                />
              ))}
            </div>
          </div>

        <div className="mb-6 space-y-3">
          <SectionHeader
            title="PROCUREMENT CYCLE TIME FLOW"
            accentClassName="bg-blue-500"
          />
          <ProcurementFlowCard
            poActual={dashboardData.poCycleTime.value}
            poTarget={6.0}
            receivingActual={dashboardData.receivingCycleTime.value}
            receivingTarget={8.0}
            totalActual={dashboardData.procurementCycleTime.value}
          />
        </div>

        <ProcurementChartsSection
          cycleTimeTrend={cycleTimeTrend}
          isCycleTimeLoading={isCycleTimeLoading}
          receivingCycleTimeTrend={receivingCycleTimeTrend}
          isReceivingCycleTimeLoading={isReceivingCycleTimeLoading}
          procurementCycleTimeTrend={procurementCycleTimeTrend}
          isProcurementCycleTimeLoading={isProcurementCycleTimeLoading}
          purchaseTrendYTD={purchaseTrendYTD}
          isPurchaseTrendLoading={isPurchaseTrendLoading}
        />
      </div>
    </section>
  );
}

export const ProcurementDashboardPage = withWorkspaceLayout(
  ProcurementDashboardContent,
);
