import { useState, useRef, useEffect, useMemo } from 'react'
import {
  Users,
  CheckCircle2,
  HeartPulse,
  Umbrella,
  UserRound,
  XCircle,
  Calendar,
  ChevronDown,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Building,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { TileCard } from '@/components/common/TileCard'
import { MultiSeriesLineChartCard } from '@/components/common/MultiSeriesLineChartCard'
import { DonutChartCard } from '@/components/common/DonutChartCard'
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from '@/components/common/withWorkspaceLayout'
import { useHrisDashboard } from '@/hooks/useHrisDashboard'
import type { HrisSCIAMonthlyPt, HrisAttendanceMonthlyPt } from '@/services/hris.service'

// --- Period -------------------------------------------------------------------

type PeriodOption = 'ytd' | 'jan-apr' | 'q1'

const PERIOD_MONTH_RANGES: Record<PeriodOption, number[] | null> = {
  ytd: null,
  'jan-apr': [1, 2, 3, 4],
  q1: [1, 2, 3],
}

function getPeriodLabel(period: PeriodOption, year: number): string {
  if (period === 'jan-apr') return `Jan - Apr ${year}`
  if (period === 'q1') return `Q1 ${year}`
  return `YTD ${year}`
}

// --- Helpers ------------------------------------------------------------------

const ID_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

function monthLabel(yyyymm: string): string {
  const m = Number.parseInt(yyyymm.split('-')[1] ?? '0', 10)
  return ID_MONTHS[m - 1] ?? yyyymm
}

function filterByPeriod<T extends { month: string }>(data: T[], period: PeriodOption): T[] {
  const range = PERIOD_MONTH_RANGES[period]
  if (!range) return data
  return data.filter((d) => {
    const m = Number.parseInt(d.month.split('-')[1] ?? '0', 10)
    return range.includes(m)
  })
}

type InsightType = 'success' | 'warning' | 'clock'
interface InsightItem {
  readonly type: InsightType
  readonly title: string
  readonly desc: string
}

function computeInsights(
  attFiltered: readonly HrisAttendanceMonthlyPt[],
  sciaFiltered: readonly HrisSCIAMonthlyPt[],
): InsightItem[] {
  const items: InsightItem[] = []

  if (attFiltered.length > 0) {
    const best = attFiltered.reduce((a, b) => (b.rate > a.rate ? b : a))
    if (best.rate > 0) {
      items.push({
        type: 'success',
        title: `Attendance terbaik pada bulan ${monthLabel(best.month).toUpperCase()}`,
        desc: `Mencapai ${best.rate.toFixed(1).replace('.', ',')}%.`,
      })
    }
  }

  if (sciaFiltered.length > 0) {
    const sc = sciaFiltered.reduce((s, p) => s + p.sakit, 0)
    const cu = sciaFiltered.reduce((s, p) => s + p.cuti, 0)
    const iz = sciaFiltered.reduce((s, p) => s + p.izin, 0)
    const al = sciaFiltered.reduce((s, p) => s + p.alfa, 0)
    const total = sc + cu + iz + al
    if (total > 0) {
      const dominantEntries: Array<[string, number]> = [['cuti', cu], ['sakit', sc], ['izin', iz], ['alfa', al]]
      const dominant = dominantEntries.reduce((a, b) => (b[1] > a[1] ? b : a), dominantEntries[0])
      const domName = { cuti: 'CUTI', sakit: 'SAKIT', izin: 'IZIN', alfa: 'ALFA' }[dominant[0]] ?? 'SCIA'
      const pct = ((dominant[1] / total) * 100).toFixed(1).replace('.', ',')
      items.push({
        type: 'warning',
        title: `Kasus ${domName} masih mendominasi (${pct}%)`,
        desc: 'Perlu strategi manajemen beban kerja & perencanaan cuti.',
      })
    }
  }

  if (attFiltered.length > 0) {
    const high = attFiltered.reduce((a, b) => (b.lateCount > a.lateCount ? b : a))
    if (high.lateCount > 0) {
      items.push({
        type: 'clock',
        title: 'Keterlambatan (Telat) perlu diperhatikan',
        desc: `Tertinggi pada bulan ${monthLabel(high.month).toUpperCase()} (${high.lateCount.toLocaleString('id-ID')} kasus).`,
      })
    }
  }

  if (sciaFiltered.length > 0) {
    const totalAlfa = sciaFiltered.reduce((s, p) => s + p.alfa, 0)
    const totalScia = sciaFiltered.reduce((s, p) => s + p.sakit + p.cuti + p.izin + p.alfa, 0)
    if (totalScia > 0) {
      const pct = ((totalAlfa / totalScia) * 100).toFixed(1).replace('.', ',')
      items.push({
        type: 'success',
        title: `Alfa sangat rendah (${pct}%)`,
        desc: 'Disiplin kehadiran tetap terjaga dengan baik.',
      })
    }
  }

  return items
}

// --- Period Filter Button -----------------------------------------------------

function PeriodFilterButton({
  value,
  year,
  onChange,
}: {
  readonly value: PeriodOption
  readonly year: number
  readonly onChange: (v: PeriodOption) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const options: PeriodOption[] = ['ytd', 'jan-apr', 'q1']

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-md border border-primary bg-white px-3 py-1.5 text-sm font-medium text-primary shadow-sm hover:bg-primary/5 transition-colors"
      >
        <Calendar className="h-4 w-4" />
        <span className="text-xs text-slate-500 mr-0.5">Periode Data</span>
        <span>{getPeriodLabel(value, year)}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`flex w-full items-center px-4 py-2 text-sm transition-colors hover:bg-primary/5 ${
                value === opt ? 'font-semibold text-primary' : 'text-slate-700'
              }`}
            >
              {getPeriodLabel(opt, year)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// --- SCIA per Karyawan Card ---------------------------------------------------

interface SciaItem { readonly label: string; readonly value: number; readonly color: string }

function SciaPerKaryawanCard({
  items,
  totalPerKaryawan,
}: {
  readonly items: readonly SciaItem[]
  readonly totalPerKaryawan: number
}) {
  const maxVal = Math.max(...items.map((i) => i.value), 0.01)

  return (
    <div className="rounded-2xl bg-white px-5 pt-4 pb-4 shadow-md w-full flex flex-col h-full">
      <h3 className="text-sm font-semibold text-gray-800 mb-0.5 uppercase tracking-wide">
        Perbandingan SCIA per Karyawan
      </h3>
      <p className="text-xs text-gray-400 mb-4">(Rata-rata Kasus / Orang)</p>
      <div className="flex flex-col gap-3 flex-1">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">{item.label}</span>
              <span className="font-bold text-gray-900">
                {item.value.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max((item.value / maxVal) * 100, 1)}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide leading-tight">
          Rata-rata Total<br />SCIA per Karyawan
        </span>
        <span className="text-xl font-bold text-slate-900">
          {totalPerKaryawan.toLocaleString('id-ID', { minimumFractionDigits: 2 })}{' '}
          <span className="text-xs font-medium text-slate-500">Kasus/Orang</span>
        </span>
      </div>
    </div>
  )
}

// --- Attendance Rate Bar Card -------------------------------------------------

interface AttRatePoint { label: string; rate: number }

function AttendanceRateCard({
  data,
  avg,
}: {
  readonly data: readonly AttRatePoint[]
  readonly avg: number
}) {
  return (
    <div className="rounded-2xl bg-white px-5 pt-4 pb-2 shadow-md w-full flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
          Attendance Rate per Bulan
        </h3>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
          <span>RATA-RATA</span>
          <span>{avg.toFixed(1).replace('.', ',')}%</span>
        </div>
      </div>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data as AttRatePoint[]} margin={{ top: 16, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[80, 100]}
              tick={{ fontSize: 10, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              formatter={(v: number) => [`${v}%`, 'Attendance Rate']}
              contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e2e8f0' }}
            />
            <ReferenceLine y={avg} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} />
            <Bar
              dataKey="rate"
              name="Attendance Rate"
              radius={[6, 6, 0, 0]}
              label={{ position: 'top', fontSize: 11, fontWeight: 600, fill: '#374151', formatter: (v: number) => `${v}%` }}
              fill="#3b82f6"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// --- Insight & Highlight Card -------------------------------------------------

function InsightHighlightCard({ insights }: { readonly insights: readonly InsightItem[] }) {
  const iconMap: Record<InsightType, React.ReactNode> = {
    success: <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />,
    clock: <Clock className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />,
  }
  const bgMap: Record<InsightType, string> = {
    success: 'bg-emerald-50 border-emerald-100',
    warning: 'bg-amber-50 border-amber-100',
    clock: 'bg-orange-50 border-orange-100',
  }
  return (
    <div className="rounded-2xl bg-white px-5 pt-4 pb-4 shadow-md w-full flex flex-col h-full">
      <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
        Insight &amp; Highlight
      </h3>
      <div className="flex flex-col gap-2.5 flex-1">
        {insights.length === 0 && (
          <p className="text-xs text-slate-400 italic">Belum ada data untuk periode ini.</p>
        )}
        {insights.map((item) => (
          <div key={item.title} className={`flex gap-2.5 rounded-xl border px-3 py-2.5 ${bgMap[item.type]}`}>
            {iconMap[item.type]}
            <div>
              <p className="text-xs font-semibold text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Total Kasus Telat Card ---------------------------------------------------

interface TelatPoint { label: string; value: number }

function KasusTelatCard({
  data,
  ytdTotal,
}: {
  readonly data: readonly TelatPoint[]
  readonly ytdTotal: number
}) {
  return (
    <div className="rounded-2xl bg-white px-5 pt-4 pb-2 shadow-md w-full flex flex-col h-full">
      <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
        Total Kasus Telat per Bulan
      </h3>
      <div className="flex flex-1 gap-3 min-h-[180px]">
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data as TelatPoint[]} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="telatGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: number) => [v.toLocaleString('id-ID'), 'Kasus Telat']}
                contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e2e8f0' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#telatGradient)"
                dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
                label={{ position: 'top', fontSize: 10, fontWeight: 600, fill: '#6b7280', formatter: (v: number) => v.toLocaleString('id-ID') }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 w-24 flex-shrink-0 rounded-xl bg-purple-50 border border-purple-100 px-3 py-3">
          <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wide text-center">Total Telat</span>
          <span className="text-xl font-bold text-gray-900">{ytdTotal.toLocaleString('id-ID')}</span>
          <span className="text-xs text-gray-500">Kasus</span>
        </div>
      </div>
    </div>
  )
}

// --- Main Page ----------------------------------------------------------------

function HrisAttendanceDashboardContent({
  selectedCompany,
}: WorkspaceLayoutInjectedProps & { selectedCompany?: string }) {
  const [period, setPeriod] = useState<PeriodOption>('ytd')
  const [year] = useState(() => new Date().getFullYear())
  const [office] = useState('Semua Kantor')

  const companyId = selectedCompany ? Number(selectedCompany) : null
  const validCompanyId = companyId && Number.isFinite(companyId) && companyId > 0 ? companyId : null

  const dashboardQuery = useHrisDashboard(validCompanyId, year)
  const apiData = dashboardQuery.data
  const isLoading = dashboardQuery.isLoading

  const sciaFiltered = useMemo(
    () => filterByPeriod(apiData?.sciaMonthly ?? [], period),
    [apiData?.sciaMonthly, period],
  )
  const attFiltered = useMemo(
    () => filterByPeriod(apiData?.attendanceMonthly ?? [], period),
    [apiData?.attendanceMonthly, period],
  )

  const totalSakit = useMemo(() => sciaFiltered.reduce((s, p) => s + p.sakit, 0), [sciaFiltered])
  const totalCuti  = useMemo(() => sciaFiltered.reduce((s, p) => s + p.cuti, 0),  [sciaFiltered])
  const totalIzin  = useMemo(() => sciaFiltered.reduce((s, p) => s + p.izin, 0),  [sciaFiltered])
  const totalAlfa  = useMemo(() => sciaFiltered.reduce((s, p) => s + p.alfa, 0),  [sciaFiltered])
  const totalTelat = useMemo(() => attFiltered.reduce((s, p) => s + p.lateCount, 0), [attFiltered])
  const totalEmployees = apiData?.kpi.totalEmployees ?? 0

  const avgAttRate = useMemo(() => {
    const valid = attFiltered.filter((p) => p.rate > 0)
    if (valid.length === 0) return 0
    return Math.round(valid.reduce((s, p) => s + p.rate, 0) / valid.length * 10) / 10
  }, [attFiltered])

  const attRateRemarks = useMemo(() => {
    const prev = apiData?.kpi.attendanceRatePrevYtd ?? 0
    if (prev === 0 || avgAttRate === 0) return undefined
    const delta = Math.round((avgAttRate - prev) * 10) / 10
    const arrow = delta >= 0 ? 'UP' : 'DOWN'
    const sign = delta >= 0 ? '+' : ''
    return `${arrow === 'UP' ? String.fromCodePoint(8593) : String.fromCodePoint(8595)} ${sign}${Math.abs(delta).toFixed(1).replace('.', ',')}% vs ${year - 1}`
  }, [avgAttRate, apiData?.kpi.attendanceRatePrevYtd, year])

  const sciaTrendData = useMemo(
    () => sciaFiltered.map((p) => ({ label: monthLabel(p.month), sakit: p.sakit, cuti: p.cuti, izin: p.izin, alfa: p.alfa })),
    [sciaFiltered],
  )
  const donutData = useMemo(() => [
    { label: 'Cuti (C)', value: totalCuti,  color: '#ec4899' },
    { label: 'Sakit (S)', value: totalSakit, color: '#14b8a6' },
    { label: 'Izin (I)',  value: totalIzin,  color: '#f97316' },
    { label: 'Alfa (A)',  value: totalAlfa,  color: '#ef4444' },
  ], [totalCuti, totalSakit, totalIzin, totalAlfa])

  const sciaItems = useMemo<SciaItem[]>(() => {
    if (totalEmployees === 0) return []
    return [
      { label: 'CUTI (C)',  value: totalCuti  / totalEmployees, color: '#ec4899' },
      { label: 'SAKIT (S)', value: totalSakit / totalEmployees, color: '#14b8a6' },
      { label: 'IZIN (I)',  value: totalIzin  / totalEmployees, color: '#f97316' },
      { label: 'ALFA (A)',  value: totalAlfa  / totalEmployees, color: '#ef4444' },
    ]
  }, [totalCuti, totalSakit, totalIzin, totalAlfa, totalEmployees])

  const sciaPerKaryawan = useMemo(
    () => totalEmployees > 0 ? (totalSakit + totalCuti + totalIzin + totalAlfa) / totalEmployees : 0,
    [totalSakit, totalCuti, totalIzin, totalAlfa, totalEmployees],
  )
  const attRateChartData = useMemo(
    () => attFiltered.map((p) => ({ label: monthLabel(p.month), rate: p.rate })),
    [attFiltered],
  )
  const telatChartData = useMemo(
    () => attFiltered.map((p) => ({ label: monthLabel(p.month), value: p.lateCount })),
    [attFiltered],
  )
  const insights = useMemo(
    () => computeInsights(attFiltered, sciaFiltered),
    [attFiltered, sciaFiltered],
  )
  const kesimpulan = useMemo(() => {
    const periodStr = getPeriodLabel(period, year)
    if (avgAttRate === 0) return `Belum ada data untuk periode ${periodStr}.`
    const best = attFiltered.length > 0
      ? attFiltered.reduce((a, b) => (b.rate > a.rate ? b : a), attFiltered[0])
      : null
    return `Rata-rata attendance ${periodStr} sebesar ${avgAttRate.toFixed(1).replace('.', ',')}%${
      best ? ` dengan capaian tertinggi pada bulan ${monthLabel(best.month)}` : ''
    }. Fokus perbaikan pada pengendalian keterlambatan dan manajemen cuti.`
  }, [attFiltered, avgAttRate, period, year])

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

  return (
    <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen">

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            HC <span className="text-primary">ATTENDANCE</span> DASHBOARD {year}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">PT ETOS - HR OPERATIONS</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <PeriodFilterButton value={period} year={year} onChange={setPeriod} />
          <button className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4 text-slate-500" />
            <span>{office}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {dashboardQuery.isError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Gagal memuat data dashboard. Coba refresh halaman.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 mb-6">
        <TileCard title="Total Karyawan" value={isLoading ? 'Memuat...' : totalEmployees.toLocaleString('id-ID')} unit="Orang" icon={Users} iconBgColor="bg-blue-100" iconColor="text-blue-600" />
        <TileCard title="Attendance Rate (YTD)" value={isLoading ? 'Memuat...' : `${avgAttRate.toFixed(1).replace('.', ',')}%`} remarks={attRateRemarks} icon={CheckCircle2} iconBgColor="bg-emerald-100" iconColor="text-emerald-600" />
        <TileCard title="Total Sakit (S)" value={isLoading ? 'Memuat...' : totalSakit.toLocaleString('id-ID')} unit="Kasus" icon={HeartPulse} iconBgColor="bg-teal-100" iconColor="text-teal-600" />
        <TileCard title="Total Cuti (C)" value={isLoading ? 'Memuat...' : totalCuti.toLocaleString('id-ID')} unit="Kasus" icon={Umbrella} iconBgColor="bg-pink-100" iconColor="text-pink-500" />
        <TileCard title="Total Izin (I)" value={isLoading ? 'Memuat...' : totalIzin.toLocaleString('id-ID')} unit="Kasus" icon={UserRound} iconBgColor="bg-orange-100" iconColor="text-orange-500" />
        <TileCard title="Total Alfa (A)" value={isLoading ? 'Memuat...' : totalAlfa.toLocaleString('id-ID')} unit="Kasus" icon={XCircle} iconBgColor="bg-red-100" iconColor="text-red-500" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12 mb-4">
        <div className="md:col-span-2 xl:col-span-5">
          <MultiSeriesLineChartCard
            title="Trend SCIA (Sakit, Cuti, Izin, Alfa) per Bulan"
            yAxisLabel="Jumlah Kasus"
            series={[
              { key: 'sakit', label: 'Sakit (S)', color: '#14b8a6' },
              { key: 'cuti',  label: 'Cuti (C)',  color: '#ec4899' },
              { key: 'izin',  label: 'Izin (I)',  color: '#f97316' },
              { key: 'alfa',  label: 'Alfa (A)',  color: '#ef4444' },
            ]}
            data={sciaTrendData}
            showDataLabels
            tooltipUnit=""
            yAxisFormatter={(v) => v.toLocaleString('id-ID')}
          />
        </div>
        <div className="xl:col-span-4">
          <DonutChartCard
            title={`Komposisi SCIA (${getPeriodLabel(period, year)})`}
            data={donutData}
            totalLabel="Total Kasus"
            valueFormatter={(v) => `${v.toLocaleString('id-ID')} Kasus`}
          />
        </div>
        <div className="xl:col-span-3">
          <SciaPerKaryawanCard items={sciaItems} totalPerKaryawan={sciaPerKaryawan} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 mb-4">
        <AttendanceRateCard data={attRateChartData} avg={avgAttRate} />
        <InsightHighlightCard insights={insights} />
        <div className="md:col-span-2 xl:col-span-1">
          <KasusTelatCard data={telatChartData} ytdTotal={totalTelat} />
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-md px-5 py-4 flex items-start gap-3">
        <Star className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">Kesimpulan </span>
          <span className="text-sm text-slate-600">{kesimpulan}</span>
        </div>
      </div>

    </section>
  )
}

const HrisAttendanceDashboardPage = withWorkspaceLayout(HrisAttendanceDashboardContent)

export default HrisAttendanceDashboardPage
