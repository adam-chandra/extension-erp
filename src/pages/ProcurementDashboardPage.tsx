import { useState, useRef, useEffect } from 'react'
import { Building, Calendar, ChevronDown, DollarSign, Package, TrendingUp, ShoppingCart } from 'lucide-react'
import { TileCard } from '@/components/common/TileCard'
import { VerticalBarChartCard } from '@/components/common/VerticalBarChartCard'
import { PieChartCard } from '@/components/common/PieChartCard'
import { MultiSeriesLineChartCard } from '@/components/common/MultiSeriesLineChartCard'
import { SingleSeriesLineChartCard } from '@/components/common/SingleSeriesLineChartCard'
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from '@/components/common/withWorkspaceLayout'

type DateFilterOption = 'all' | 'month' | 'year' | 'custom'

const DATE_FILTER_LABELS: Record<DateFilterOption, string> = {
  all: 'All Time',
  month: 'This Month',
  year: 'This Year',
  custom: 'Custom Range',
}

function DateFilterDropdown({
  value,
  onChange,
}: {
  value: DateFilterOption
  onChange: (v: DateFilterOption) => void
}) {
  const [open, setOpen] = useState(false)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const options: DateFilterOption[] = ['all', 'month', 'year', 'custom']

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-md border border-primary bg-white px-3 py-1.5 text-sm font-medium text-primary shadow-sm hover:bg-primary/5 transition-colors"
      >
        <Calendar className="h-4 w-4" />
        <span>{DATE_FILTER_LABELS[value]}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-52 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt)
                if (opt !== 'custom') setOpen(false)
              }}
              className={`flex w-full items-center px-4 py-2 text-sm transition-colors hover:bg-primary/5 ${
                value === opt ? 'font-semibold text-primary' : 'text-slate-700'
              }`}
            >
              {DATE_FILTER_LABELS[opt]}
            </button>
          ))}

          {value === 'custom' && (
            <div className="border-t border-slate-100 px-4 py-3 flex flex-col gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                onClick={() => setOpen(false)}
                className="mt-1 w-full rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ProcurementDashboardContent({ selectedCompany }: WorkspaceLayoutInjectedProps & { selectedCompany?: string }) {
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all')

  if (!selectedCompany) {
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

  return (
    <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">DASHBOARD PROCUREMENT</h1>
        <DateFilterDropdown value={dateFilter} onChange={setDateFilter} />
      </div>

      {/* Row 1 — 4 KPI tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <TileCard
          title="Total Purchase Orders"
          value="1,254"
          icon={ShoppingCart}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
          cardId="proc-tile-po"
          module="procurement"
        />
        <TileCard
          title="Total Spending"
          value="Rp 8,500,000,000"
          icon={DollarSign}
          iconBgColor="bg-red-100"
          iconColor="text-red-500"
          cardId="proc-tile-spending"
          module="procurement"
        />
        <TileCard
          title="Active Suppliers"
          value="342"
          icon={Package}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          cardId="proc-tile-suppliers"
          module="procurement"
        />
        <TileCard
          title="Cost Savings"
          value="12.3%"
          icon={TrendingUp}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          cardId="proc-tile-savings"
          module="procurement"
        />
      </div>

      {/* Row 2 — Purchase Trend | Spending by Category */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-6">
        <MultiSeriesLineChartCard
          title="Purchase Order Trend"
          yAxisLabel="Orders"
          series={[
            { key: 'orders', label: 'PO Count', color: '#f59e0b' },
            { key: 'value', label: 'Value (M)', color: '#3b82f6' },
          ]}
          data={[
            { label: 'Jan', orders: 95, value: 6.5 },
            { label: 'Feb', orders: 102, value: 7.0 },
            { label: 'Mar', orders: 110, value: 7.5 },
            { label: 'Apr', orders: 105, value: 7.2 },
            { label: 'May', orders: 108, value: 7.4 },
            { label: 'Jun', orders: 115, value: 7.8 },
            { label: 'Jul', orders: 120, value: 8.2 },
            { label: 'Aug', orders: 118, value: 8.0 },
            { label: 'Sep', orders: 112, value: 7.6 },
            { label: 'Oct', orders: 125, value: 8.5 },
            { label: 'Nov', orders: 130, value: 8.8 },
          ]}
          cardId="proc-chart-po-trend"
          module="procurement"
        />

        <PieChartCard
          title="Spending by Category"
          data={[
            { label: 'Raw Materials', value: 40, color: '#f59e0b' },
            { label: 'Equipment', value: 25, color: '#3b82f6' },
            { label: 'Services', value: 20, color: '#10b981' },
            { label: 'Others', value: 15, color: '#8b5cf6' },
          ]}
          cardId="proc-chart-spending-category"
          module="procurement"
        />
      </div>

      {/* Row 3 — Supplier Performance | Lead Time Analysis */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <VerticalBarChartCard
          title="Top Suppliers by Volume"
          yAxisLabel="Orders"
          series={[{ key: 'orders', label: 'Purchase Orders', color: '#f59e0b' }]}
          data={[
            { label: 'Supplier A', orders: 145 },
            { label: 'Supplier B', orders: 132 },
            { label: 'Supplier C', orders: 120 },
            { label: 'Supplier D', orders: 98 },
            { label: 'Supplier E', orders: 85 },
          ]}
          cardId="proc-chart-top-suppliers"
          module="procurement"
        />

        <SingleSeriesLineChartCard
          title="Average Lead Time (Days)"
          seriesLabel="Lead Time"
          color="#f59e0b"
          unit=" days"
          data={[
            { label: 'Jan', value: 15 },
            { label: 'Feb', value: 14 },
            { label: 'Mar', value: 16 },
            { label: 'Apr', value: 13 },
            { label: 'May', value: 12 },
            { label: 'Jun', value: 11 },
            { label: 'Jul', value: 10 },
            { label: 'Aug', value: 11 },
            { label: 'Sep', value: 12 },
            { label: 'Oct', value: 10 },
            { label: 'Nov', value: 9 },
            { label: 'Dec', value: 8 },
          ]}
          cardId="proc-chart-lead-time"
          module="procurement"
        />
      </div>
    </section>
  )
}

export const ProcurementDashboardPage = withWorkspaceLayout(ProcurementDashboardContent)
