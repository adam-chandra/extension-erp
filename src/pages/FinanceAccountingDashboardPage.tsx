import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building, CreditCard, Wallet, PackageMinus, Receipt } from 'lucide-react'
import { TileCard } from '@/components/common/TileCard'
import { MultiSeriesLineChartCard } from '@/components/common/MultiSeriesLineChartCard'
import { ListViewCard } from '@/components/common/ListViewCard'
import { DateFilterDropdown } from '@/components/common/DateFilterDropdown'
import { ROUTES } from '@/config/routes'
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from '@/components/common/withWorkspaceLayout'
import {
  useFinanceDashboard,
  useFinanceReturnsByAccount,
} from '@/hooks/useFinanceDashboard'
import { formatIDR, formatMonthLabel, RETUR_PENJUALAN_COLUMNS } from '@/utils/finance'
import type { DashboardDateRange, DashboardPeriod } from '@/services/finance.service'
import type { DateFilterOption } from '@/types/procurement'

function scaleForChart(value: number): number {
  return Math.round((value / 1_000_000_000) * 100) / 100
}

function FinanceAccountingDashboardContent({ selectedCompany }: WorkspaceLayoutInjectedProps & { selectedCompany?: string }) {
  const [dateFilter, setDateFilter] = useState<DashboardPeriod>('all')
  const [customRange, setCustomRange] = useState<DashboardDateRange>({})
  const navigate = useNavigate()

  const companyId = selectedCompany ? Number(selectedCompany) : null
  const validCompanyId = companyId && Number.isFinite(companyId) && companyId > 0 ? companyId : null

  const dashboardQuery = useFinanceDashboard(validCompanyId, dateFilter, customRange)
  const returAccountsQuery = useFinanceReturnsByAccount(validCompanyId, dateFilter, customRange, 10)

  const kpi = dashboardQuery.data?.kpi
  const trend = dashboardQuery.data?.trend ?? []

  const chartData = useMemo(
    () =>
      trend.map((t) => ({
        label: formatMonthLabel(t.month),
        salesNet: scaleForChart(t.salesNet),
        costOfRevenue: scaleForChart(t.costOfRevenue),
      })),
    [trend],
  )

  const returAccounts = returAccountsQuery.data ?? []

  if (!validCompanyId) {
    return (
      <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Building className="mx-auto h-16 w-16 text-slate-300" />
          <h2 className="text-2xl font-semibold text-slate-700">Silakan pilih company</h2>
          <p className="text-slate-500">Pilih company dari sidebar untuk menampilkan dashboard</p>
        </div>
      </section>
    )
  }

  const isLoading = dashboardQuery.isLoading
  const hasError = dashboardQuery.isError

  return (
    <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">DASHBOARD FINANCE & ACCOUNTING</h1>
        <DateFilterDropdown
          value={dateFilter as DateFilterOption}
          onChange={(v, start, end) => {
            setDateFilter(v as DashboardPeriod)
            setCustomRange(v === 'custom' ? { start: start ?? '', end: end ?? '' } : {})
          }}
        />
      </div>

      {hasError ? (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Gagal memuat data dashboard. Coba refresh halaman.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <TileCard
          title="Penjualan Bersih"
          value={isLoading ? 'Memuat…' : formatIDR(kpi?.salesNet ?? 0)}
          icon={Wallet}
          iconBgColor="bg-blue-100"
          iconColor="text-[#3ca6e0]"
          cardId="fin-tile-sales-net"
          module="accounting"
          onClick={() => navigate(ROUTES.REVENUE)}
        />
        <TileCard
          title="Potongan Penjualan"
          value={isLoading ? 'Memuat…' : formatIDR(kpi?.salesDiscount ?? 0)}
          icon={CreditCard}
          iconBgColor="bg-blue-50"
          iconColor="text-[#3ca6e0]"
          cardId="fin-tile-discounts"
          module="accounting"
          onClick={() => navigate(ROUTES.POTONGAN_PENJUALAN)}
        />
        <TileCard
          title="Retur Penjualan"
          value={isLoading ? 'Memuat…' : formatIDR(kpi?.salesReturn ?? 0)}
          icon={PackageMinus}
          iconBgColor="bg-blue-100"
          iconColor="text-[#3ca6e0]"
          cardId="fin-tile-returns"
          module="accounting"
          onClick={() => navigate(ROUTES.RETUR_PENJUALAN)}
        />
        <TileCard
          title="Biaya Penjualan"
          value={isLoading ? 'Memuat…' : formatIDR(kpi?.costOfRevenue ?? 0)}
          icon={Receipt}
          iconBgColor="bg-blue-50"
          iconColor="text-[#3ca6e0]"
          cardId="fin-tile-cost-of-revenue"
          module="accounting"
          onClick={() => navigate(ROUTES.BIAYA_PENJUALAN)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 mb-6">
        <MultiSeriesLineChartCard
          title="Tren Penjualan Bersih vs Biaya Penjualan"
          yAxisLabel="Rp (Miliar)"
          series={[
            { key: 'salesNet', label: 'Penjualan Bersih', color: '#3ca6e0' },
            { key: 'costOfRevenue', label: 'Biaya Penjualan', color: '#f29015' },
          ]}
          data={chartData}
          cardId="fin-chart-sales-vs-cost"
          module="accounting"
        />

        <ListViewCard
          title="Retur Penjualan"
          data={returAccounts.map((r) => ({
            no: r.no,
            code: r.code,
            deskripsi: r.name,
            nilaiRetur: r.balance,
            persentaseRetur: `${r.percentage.toFixed(1)}%`,
          }))}
          columns={RETUR_PENJUALAN_COLUMNS('60px', '180px')}
          pagination={true}
          itemsPerPage={10}
          cardId="fin-list-retur-penjualan"
          module="accounting"
        />
      </div>
    </section>
  )
}

export const FinanceAccountingDashboardPage = withWorkspaceLayout(FinanceAccountingDashboardContent)
