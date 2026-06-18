import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { CardMenu } from './CardMenu'

interface Series {
  readonly key: string
  readonly label: string
  readonly color: string
}

interface DataPoint {
  readonly label: string
  readonly [key: string]: number | string
}

interface HorizontalBarChartCardProps {
  readonly title: string
  readonly xAxisLabel?: string
  readonly series: Series[]
  readonly data: DataPoint[]
  readonly cardId?: string
  readonly module?: 'central-dashboard' | 'procurement' | 'accounting' | 'hris'
  readonly customMenu?: React.ReactNode
}

export function HorizontalBarChartCard({
  title,
  xAxisLabel = 'Rp (M)',
  series,
  data,
  cardId,
  module,
  customMenu,
}: HorizontalBarChartCardProps) {
  const showMenu = (cardId && module) || customMenu

  return (
    <div className="relative rounded-2xl bg-white px-5 pt-4 pb-2 shadow-md w-full overflow-hidden flex flex-col h-full">
      {/* Header with title and menu */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-gray-800 flex-1 min-w-0 line-clamp-2">{title}</h3>
        {showMenu && (
          <div className="flex-shrink-0 -mt-1">
            {customMenu || (
              <CardMenu
                cardId={cardId!}
                cardType="horizontalBar"
                cardData={{ title, xAxisLabel, series, data }}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ top: 4, right: 16, left: 0, bottom: 20 }}
            barCategoryGap="30%"
            barGap={3}
          >
            <CartesianGrid horizontal={false} stroke="#e5e7eb" />
            <XAxis
              type="number"
              label={{
                value: xAxisLabel,
                position: 'insideBottom',
                offset: -15,
                style: { fontSize: 12, fill: '#9ca3af' },
              }}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <YAxis
              type="category"
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, fill: '#6b7280' }}
              width={100}
            />
            <Tooltip
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                fontSize: 13,
              }}
            />
            <Legend
              align="right"
              verticalAlign="top"
              iconType="square"
              iconSize={12}
              wrapperStyle={{ fontSize: 13, paddingBottom: 8 }}
              formatter={(value) =>
                series.find((s) => s.key === value)?.label ?? value
              }
            />
            {series.map((s) => (
              <Bar key={s.key} dataKey={s.key} name={s.key} fill={s.color} radius={[0, 3, 3, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
