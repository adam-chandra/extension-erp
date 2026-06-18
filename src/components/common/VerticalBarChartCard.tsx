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
  key: string
  label: string
  color: string
}

interface DataPoint {
  label: string
  [key: string]: number | string
}

interface VerticalBarChartCardProps {
  title: string
  yAxisLabel?: string
  series: Series[]
  data: DataPoint[]
  cardId?: string
  module?: 'central-dashboard' | 'procurement' | 'accounting' | 'hris'
  customMenu?: React.ReactNode
}

export function VerticalBarChartCard({
  title,
  yAxisLabel = 'Rp (M)',
  series,
  data,
  cardId,
  module,
  customMenu,
}: VerticalBarChartCardProps) {
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
                cardType="verticalBar"
                cardData={{ title, yAxisLabel, series, data }}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
          barCategoryGap="30%"
          barGap={3}
        >
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 13, fill: '#6b7280' }}
          />
          <YAxis
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              offset: 12,
              style: { fontSize: 12, fill: '#9ca3af' },
            }}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
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
            <Bar key={s.key} dataKey={s.key} name={s.key} fill={s.color} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>      </div>    </div>
  )
}