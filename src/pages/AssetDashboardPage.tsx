import { SummaryCard, type SummaryCardProps } from "@/components/common/SummaryCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { BarChart } from "@/components/charts/BarChart";
import {
  DepartmentList,
  DonutLegendList,
  LifecycleAverageAge,
  OwnershipSummary,
  ProgressList,
  SectionCard,
  StatMiniCard,
} from "@/components/common/AssetDashboardCommon";
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from "@/components/common/withWorkspaceLayout";
import { useAssetDashboard } from "@/hooks/useAssetDashboard";
import { getAssetDashboardData, type AssetKpiItem } from "@/data/asset";
import { formatCurrency, formatCurrencyIDR, formatNumber } from "@/lib/utils";
import type { AssetDashboardSummary } from "@/types/asset-dashboard";
import {
  BarChart3,
  Box,
  Briefcase,
  ClipboardCheck,
  Hourglass,
  MapPin,
  Monitor,
  Search,
  Trash2,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

const kpiIconMap = {
  box: Box,
  wallet: Wallet,
  monitor: Monitor,
  hourglass: Hourglass,
  wrench: Wrench,
  search: Search,
} as const;

function buildAssetSummary(kpis: AssetKpiItem[]): SummaryCardProps[] {
  return kpis.map((item) => ({
    icon: kpiIconMap[item.icon],
    label: item.label,
    value:
      typeof item.value === "number"
        ? item.label === "Total Asset Value"
          ? formatCurrency(item.value)
          : formatNumber(item.value)
        : item.value,
    unitLabel:
      item.label === "Total Asset Value" && typeof item.value === "number"
        ? formatCurrencyIDR(item.value)
        : item.unit ?? "unit",
    color: item.color,
    trend: item.trend,
  }));
}

function mergeSummaryWithApi(kpis: AssetKpiItem[], apiData?: AssetDashboardSummary): AssetKpiItem[] {
  if (!apiData) return kpis;

  return kpis.map((item) => {
    switch (item.icon) {
      case "box":
        return { ...item, value: apiData.totalUnitAsset };
      case "wallet":
        return { ...item, value: apiData.totalAssetValue };
      case "monitor":
        return { ...item, value: apiData.status.active };
      case "hourglass":
        return { ...item, value: apiData.status.idle };
      case "wrench":
        return { ...item, value: apiData.status.damage };
      case "search":
        return { ...item, value: apiData.status.missing };
      default:
        return item;
    }
  });
}

function AssetDashboardContent({ selectedCompany }: WorkspaceLayoutInjectedProps & { selectedCompany?: string }) {
  const companyId = selectedCompany ? Number(selectedCompany) : 1;
  const validCompanyId = companyId && Number.isFinite(companyId) && companyId > 0 ? companyId : 1;

  const dashboardData = getAssetDashboardData(validCompanyId);
  const { data: dynamicSummary } = useAssetDashboard(validCompanyId);
  const mergedKpis = mergeSummaryWithApi(dashboardData.kpis, dynamicSummary);
  const assetSummary = buildAssetSummary(mergedKpis);
  const totalSummary = assetSummary.filter((item) => item.label.toLowerCase().includes("total"));
  const statusSummary = assetSummary.filter((item) => !item.label.toLowerCase().includes("total"));
  const locationBarData = dashboardData.location.topOfficeBars.map((item) => ({
    name: item.name,
    value: item.value,
  }));

  const kpiCardClassName = "min-h-[130px] bg-white";

  return (
    <section className="min-h-screen flex-1 bg-white p-4 text-slate-800 sm:p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">{dashboardData.title}</h1>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statusSummary.map((summary) => (
            <SummaryCard key={summary.label} {...summary} className={kpiCardClassName} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {totalSummary.map((summary) => (
            <SummaryCard key={summary.label} {...summary} className={kpiCardClassName} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <SectionCard
            title="ASSET BY LOCATION"
            icon={MapPin}
            iconClassName="text-blue-600"
            className="lg:col-span-12"
            rightSlot={
              <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium outline-hidden">
                <option>{dashboardData.location.filterLabel}</option>
              </select>
            }
          >
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              <div className="flex justify-center lg:col-span-3">
                <DonutChart
                  data={dashboardData.location.donut}
                  centerText={dashboardData.location.totalLabel}
                  centerSubtext="Total Asset"
                  chartWidth={190}
                  chartHeight={190}
                  innerRadius={55}
                  outerRadius={82}
                  paddingAngle={1}
                  labelFontSize={10}
                />
              </div>

              <div className="lg:col-span-3">
                <DonutLegendList items={dashboardData.location.donut} />
              </div>

              <div className="lg:col-span-6">
                <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Jumlah Aset Per Kantor (Top 5)
                </p>
                <BarChart
                  data={locationBarData}
                  dataKey="value"
                  fill="#2563eb"
                  height={230}
                  barSize={28}
                  showLabels
                  showGrid={false}
                  showYAxis
                  showXAxis
                  gradient={false}
                  xAxisAngle={0}
                  borderRadius={5}
                />
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <SectionCard
            title="ASSET BY CATEGORY"
            icon={Briefcase}
            iconClassName="text-blue-600"
            className="lg:col-span-12"
            rightSlot={
              <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium outline-hidden">
                <option>{dashboardData.category.filterLabel}</option>
              </select>
            }
          >
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
              <div className="flex justify-center lg:col-span-3">
                <DonutChart
                  data={dashboardData.category.donut}
                  centerText={dashboardData.category.totalLabel}
                  centerSubtext="Total Asset"
                  chartWidth={190}
                  chartHeight={190}
                  innerRadius={55}
                  outerRadius={82}
                  paddingAngle={1}
                  labelFontSize={10}
                />
              </div>

              <div className="overflow-x-auto lg:col-span-9">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400">
                      <th className="pb-2 font-medium">Kategori Aset</th>
                      <th className="pb-2 text-right font-medium">Total Unit</th>
                      <th className="pb-2 text-right font-medium">Nilai Aset (Rp)</th>
                      <th className="pb-2 text-right font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700">
                    {dashboardData.category.rows.map((row) => (
                      <tr key={row.category}>
                        <td className="flex items-center gap-1.5 py-2">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: row.color }} />
                          {row.category}
                        </td>
                        <td className="py-2 text-right font-medium">{formatNumber(row.unit)} unit</td>
                        <td className="py-2 text-right font-medium text-slate-800">{formatCurrency(row.value)}</td>
                        <td className="py-2 text-right text-slate-500">{row.percentageLabel}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-slate-200 font-bold text-slate-900">
                      <td className="py-2">Total</td>
                      <td className="py-2 text-right">{dashboardData.category.totalUnitLabel} unit</td>
                      <td className="py-2 text-right">{formatCurrency(dashboardData.category.totalValue)}</td>
                      <td className="py-2 text-right">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <SectionCard
            title="ASSET OWNERSHIP OVERVIEW"
            icon={Users}
            iconClassName="text-purple-600"
            className="lg:col-span-4"
          >
            <OwnershipSummary
              totalOwnersLabel={dashboardData.ownership.totalOwnersLabel}
              assignedPercentLabel={dashboardData.ownership.assignedPercentLabel}
              assignedProgress={dashboardData.ownership.assignedProgress}
            />
            <DepartmentList
              title="Aset Terassign Per Departemen (Top 5)"
              items={dashboardData.ownership.departments}
            />
          </SectionCard>

          <SectionCard
            title="AUDIT & STOCK OPNAME"
            icon={ClipboardCheck}
            iconClassName="text-blue-600"
            className="lg:col-span-5"
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {dashboardData.audit.cards.map((card) => (
                <StatMiniCard key={card.title} {...card} />
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Progress Per Area"
            icon={MapPin}
            iconClassName="text-slate-400"
            className="lg:col-span-3"
          >
            <ProgressList items={dashboardData.progressArea} />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <SectionCard
            title="ASSET LIFECYCLE OVERVIEW"
            icon={BarChart3}
            iconClassName="text-purple-600"
            className="lg:col-span-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
              <div className="sm:col-span-4 flex justify-center">
                <DonutChart
                  data={dashboardData.lifecycle.donut}
                  centerText={dashboardData.lifecycle.totalLabel}
                  centerSubtext="Total Asset"
                  chartWidth={170}
                  chartHeight={170}
                  innerRadius={48}
                  outerRadius={74}
                  paddingAngle={1}
                  labelFontSize={10}
                />
              </div>

              <div className="sm:col-span-4 flex flex-col justify-center">
                <DonutLegendList items={dashboardData.lifecycle.donut} />
              </div>

              <div className="sm:col-span-4">
                <LifecycleAverageAge
                  averageAgeLabel={dashboardData.lifecycle.averageAgeLabel}
                  averageAgeSubLabel={dashboardData.lifecycle.averageAgeSubLabel}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="IDLE & DISPOSAL OVERVIEW"
            icon={Trash2}
            iconClassName="text-purple-600"
            className="lg:col-span-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {dashboardData.idleDisposal.map((item) => (
                <StatMiniCard key={item.title} {...item} className="h-auto" />
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </section>
  );
}

const AssetDashboardPage = withWorkspaceLayout(AssetDashboardContent);

export default AssetDashboardPage;