import { 
  Building, 
  LayoutDashboard, 
  Coins, 
  DollarSign, 
  PercentCircle, 
  Target, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Wallet, 
  CreditCard,
  Calendar,
  ChevronDown
} from 'lucide-react'
import { useDashboardCards } from '@/context/DashboardCardsContext'
import { TileCard } from '@/components/common/TileCard'
import { VerticalBarChartCard } from '@/components/common/VerticalBarChartCard'
import { PieChartCard } from '@/components/common/PieChartCard'
import { MultiSeriesLineChartCard } from '@/components/common/MultiSeriesLineChartCard'
import { SingleSeriesLineChartCard } from '@/components/common/SingleSeriesLineChartCard'
import { CentralDashboardCardMenu } from '@/components/common/CentralDashboardCardMenu'
import { useMemo, useState, useRef, useEffect } from 'react'
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

// Helper to map icon names to components
const iconMap: Record<string, any> = {
  Coins,
  DollarSign,
  PercentCircle,
  Target,
  ShoppingCart,
  Package,
  TrendingUp,
  Wallet,
  CreditCard,
}

function CentralDashboardContent({ 
  selectedCompany
}: WorkspaceLayoutInjectedProps & { 
  selectedCompany?: string
}) {
  const { cards } = useDashboardCards()
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all')

  // Filter cards based on selected module
  const filteredCards = useMemo(() => {
    // Central Dashboard only shows cards with module 'central-dashboard'
    return cards.filter((card) => card.module === 'central-dashboard')
  }, [cards])

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

  if (filteredCards.length === 0) {
    return (
      <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">CENTRAL DASHBOARD</h1>
          </div>
          <DateFilterDropdown value={dateFilter} onChange={setDateFilter} />
        </div>

        {/* Empty state */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <LayoutDashboard className="mx-auto h-20 w-20 text-slate-300" />
            <h2 className="text-2xl font-semibold text-slate-700">Belum Ada Card Terpilih</h2>
            <p className="text-slate-500 max-w-md">
              Silakan Pilih Card Pada Setiap Modul Yang Tersedia
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Separate cards by type for better layout
  const tileCards = filteredCards.filter((c) => c.type === 'tile')
  const chartCards = filteredCards.filter((c) => c.type !== 'tile')

  return (
    <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CENTRAL DASHBOARD</h1>
          <p className="text-sm text-slate-600 mt-1">
            {filteredCards.length} card{filteredCards.length === 1 ? '' : 's'}
          </p>
        </div>
        <DateFilterDropdown value={dateFilter} onChange={setDateFilter} />
      </div>

      {/* Tile cards */}
      {tileCards.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
          {tileCards.map((card) => (
            <TileCard
              key={card.id}
              title={card.data.title}
              value={card.data.value}
              icon={iconMap[card.data.icon] || Coins}
              iconBgColor={card.data.iconBgColor}
              iconColor={card.data.iconColor}
              customMenu={<CentralDashboardCardMenu cardId={card.id} />}
            />
          ))}
        </div>
      )}

      {/* Chart cards */}
      {chartCards.length > 0 && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {chartCards.map((card) => {
            const menu = <CentralDashboardCardMenu cardId={card.id} />

            switch (card.type) {
              case 'verticalBar':
                return (
                  <VerticalBarChartCard
                    key={card.id}
                    title={card.data.title}
                    yAxisLabel={card.data.yAxisLabel}
                    series={card.data.series}
                    data={card.data.data}
                    customMenu={menu}
                  />
                )
              case 'pie':
                return (
                  <PieChartCard
                    key={card.id}
                    title={card.data.title}
                    data={card.data.data}
                    unit={card.data.unit}
                    customMenu={menu}
                  />
                )
              case 'multiLine':
                return (
                  <MultiSeriesLineChartCard
                    key={card.id}
                    title={card.data.title}
                    yAxisLabel={card.data.yAxisLabel}
                    series={card.data.series}
                    data={card.data.data}
                    customMenu={menu}
                  />
                )
              case 'singleLine':
                return (
                  <SingleSeriesLineChartCard
                    key={card.id}
                    title={card.data.title}
                    seriesLabel={card.data.seriesLabel}
                    color={card.data.color}
                    yAxisLabel={card.data.yAxisLabel}
                    unit={card.data.unit}
                    data={card.data.data}
                    customMenu={menu}
                  />
                )
              default:
                return null
            }
          })}
        </div>
      )}
    </section>
  )
}

export const CentralDashboard = withWorkspaceLayout(CentralDashboardContent)
