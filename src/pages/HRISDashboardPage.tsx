import { useState, useRef, useEffect, useMemo } from 'react'
import { Building, Calendar, ChevronDown, Users, UserCheck, UserPlus, TrendingUp } from 'lucide-react'
import { TileCard } from '@/components/common/TileCard'
import { DonutChartCard } from '@/components/common/DonutChartCard'
import { VerticalBarChartCard } from '@/components/common/VerticalBarChartCard'
import { HorizontalBarChartCard } from '@/components/common/HorizontalBarChartCard'
import { SingleSeriesLineChartCard } from '@/components/common/SingleSeriesLineChartCard'
import { MultiSeriesLineChartCard } from '@/components/common/MultiSeriesLineChartCard'
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from '@/components/common/withWorkspaceLayout'
import { useHrisDashboard } from '@/hooks/useHrisDashboard'

type DateFilterOption = 'all' | 'month' | 'year' | 'custom'

const DATE_FILTER_LABELS: Record<DateFilterOption, string> = {
  all: 'All Time',
  month: 'This Month',
  year: 'This Year',
  custom: 'Custom Range',
}

const DONUT_PALETTE = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#ef4444',
  '#84cc16',
  '#a855f7',
  '#6b7280',
]

function DateFilterDropdown({
  value,
  onChange,
}: {
  readonly value: DateFilterOption
  readonly onChange: (v: DateFilterOption) => void
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
                <label htmlFor="custom-start-date" className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
                <input
                  id="custom-start-date"
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="custom-end-date" className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
                <input
                  id="custom-end-date"
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

function formatMonthLabel(yyyymm: string): string {
  if (!yyyymm) return ''
  const [yStr, mStr] = yyyymm.split('-')
  const y = Number(yStr)
  const m = Number(mStr)
  if (!Number.isFinite(y) || !Number.isFinite(m)) return yyyymm
  const date = new Date(Date.UTC(y, m - 1, 1))
  const short = date.toLocaleString('id-ID', { month: 'short' })
  return `${short} '${String(y).slice(-2)}`
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('id-ID').format(n)
}

function HRISDashboardContent({ selectedCompany }: WorkspaceLayoutInjectedProps & { selectedCompany?: string }) {
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all')

  const companyId = selectedCompany ? Number(selectedCompany) : null
  const validCompanyId = companyId && Number.isFinite(companyId) && companyId > 0 ? companyId : null

  const year = new Date().getFullYear()
  const dashboardQuery = useHrisDashboard(validCompanyId, year)
  const data = dashboardQuery.data
  const kpi = data?.kpi

  const deptDonut = useMemo(() => {
    const rows = data?.deptHeadcount ?? []
    const sorted = [...rows].sort((a, b) => b.count - a.count)
    const top = sorted.slice(0, 9)
    const othersTotal = sorted.slice(9).reduce((sum, r) => sum + r.count, 0)
    const out = top.map((r, idx) => ({
      label: r.departmentName,
      value: r.count,
      color: DONUT_PALETTE[idx % DONUT_PALETTE.length],
    }))
    if (othersTotal > 0) {
      out.push({ label: 'Others', value: othersTotal, color: DONUT_PALETTE[9] })
    }
    return out
  }, [data?.deptHeadcount])

  const recruitmentBars = useMemo(
    () =>
      (data?.recruitment ?? []).map((m) => ({
        label: formatMonthLabel(m.month),
        hires: m.count,
      })),
    [data?.recruitment],
  )

  const salaryBars = useMemo(() => {
    const rows = data?.salaryByDept ?? []
    return [...rows]
      .sort((a, b) => b.totalSalary - a.totalSalary)
      .slice(0, 8)
      .map((r) => ({
        label: r.departmentName,
        salary: Math.round((r.totalSalary / 1_000_000) * 100) / 100,
      }))
  }, [data?.salaryByDept])

  const attendanceLine = useMemo(
    () =>
      (data?.attendanceTrend ?? []).map((p) => ({
        label: formatMonthLabel(p.month),
        value: p.rate,
      })),
    [data?.attendanceTrend],
  )

  const workforceLine = useMemo(
    () =>
      (data?.workforceTrend ?? []).map((p) => ({
        label: formatMonthLabel(p.month),
        employees: p.employees,
        hires: p.hires,
        exits: p.exits,
      })),
    [data?.workforceTrend],
  )

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

  // dateFilter kept in state for UI parity with finance dashboard; backend
  // currently returns a fixed 12-month window, so the value is unused.
  void dateFilter

  return (
    <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">DASHBOARD HRIS</h1>
        <DateFilterDropdown value={dateFilter} onChange={setDateFilter} />
      </div>

      {hasError ? (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Gagal memuat data dashboard. Coba refresh halaman.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <TileCard
          title="Total Karyawan"
          value={isLoading ? 'Memuat…' : formatNumber(kpi?.totalEmployees ?? 0)}
          icon={Users}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          cardId="hris-tile-employees"
          module="hris"
        />
        <TileCard
          title="Attendance Rate"
          value={isLoading ? 'Memuat…' : `${(kpi?.attendanceRateYtd ?? 0).toFixed(1)}%`}
          icon={UserCheck}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          cardId="hris-tile-attendance"
          module="hris"
        />
        <TileCard
          title="New Hires (12 bln)"
          value={isLoading ? 'Memuat…' : formatNumber(kpi?.newHires ?? 0)}
          icon={UserPlus}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          cardId="hris-tile-newhires"
          module="hris"
        />
        <TileCard
          title="Turnover Rate"
          value={isLoading ? 'Memuat…' : `${(kpi?.turnoverRate ?? 0).toFixed(1)}%`}
          icon={TrendingUp}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
          cardId="hris-tile-turnover"
          module="hris"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-6">
        <DonutChartCard
          title="Distribusi Karyawan per Departemen"
          data={deptDonut}
          totalLabel="Total Karyawan"
          cardId="hris-chart-dept-distribution"
          module="hris"
        />

        <VerticalBarChartCard
          title="Rekrutmen per Bulan"
          yAxisLabel="Jumlah"
          series={[{ key: 'hires', label: 'New Hires', color: '#8b5cf6' }]}
          data={recruitmentBars}
          cardId="hris-chart-recruitment"
          module="hris"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-6">
        <HorizontalBarChartCard
          title="Total Gaji per Departemen (bulan terakhir)"
          xAxisLabel="Rp (Juta)"
          series={[{ key: 'salary', label: 'Total Salary', color: '#10b981' }]}
          data={salaryBars}
          cardId="hris-chart-salary"
          module="hris"
        />

        <SingleSeriesLineChartCard
          title="Tingkat Absensi Bulanan"
          seriesLabel="Attendance Rate"
          color="#10b981"
          unit="%"
          data={attendanceLine}
          cardId="hris-chart-attendance"
          module="hris"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <MultiSeriesLineChartCard
          title="Tren Karyawan & Turnover"
          yAxisLabel="Jumlah"
          series={[
            { key: 'employees', label: 'Total Karyawan', color: '#3b82f6' },
            { key: 'hires', label: 'New Hires', color: '#10b981' },
            { key: 'exits', label: 'Exits', color: '#ef4444' },
          ]}
          data={workforceLine}
          cardId="hris-chart-employee-trend"
          module="hris"
        />
      </div>
    </section>
  )
}

const HRISDashboardPage = withWorkspaceLayout(HRISDashboardContent)

export default HRISDashboardPage
