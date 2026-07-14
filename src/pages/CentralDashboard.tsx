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
} from 'lucide-react'
import { useDashboardCards } from '@/context/DashboardCardsContext'
import { TileCard } from '@/components/common/TileCard'
import { VerticalBarChartCard } from '@/components/common/VerticalBarChartCard'
import { PieChartCard } from '@/components/common/PieChartCard'
import { MultiSeriesLineChartCard } from '@/components/common/MultiSeriesLineChartCard'
import { SingleSeriesLineChartCard } from '@/components/common/SingleSeriesLineChartCard'
import { CentralDashboardCardMenu } from '@/components/common/CentralDashboardCardMenu'
import { DateFilterDropdown } from '@/components/common/DateFilterDropdown'
import { useMemo, useState } from 'react'
import { type DateFilterOption } from '@/types/procurement'
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from '@/components/common/withWorkspaceLayout'

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
  const handleDateFilterChange = (value: DateFilterOption) => {
    setDateFilter(value)
  }

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
        <DateFilterDropdown value={dateFilter} onChange={handleDateFilterChange} />
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
