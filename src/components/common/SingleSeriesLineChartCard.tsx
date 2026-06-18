import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { CardMenu } from './CardMenu'

interface DataPoint {
  label: string
  value: number
}

interface SingleSeriesLineChartCardProps {
  title: string
  seriesLabel: string
  color?: string
  yAxisLabel?: string
  unit?: string
  data: DataPoint[]
  cardId?: string
  module?: 'central-dashboard' | 'procurement' | 'accounting' | 'hris'
  customMenu?: React.ReactNode
}

export function SingleSeriesLineChartCard({
  title,
  seriesLabel,
  color = '#4ade80',
  yAxisLabel,
  unit = '%',
  data,
  cardId,
  module,
  customMenu,
}: SingleSeriesLineChartCardProps) {
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
                cardType="singleLine"
                cardData={{ title, seriesLabel, color, yAxisLabel, unit, data }}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fill-single" x1="0" y1="0" x2="0" y2="1">
              {/* Strong fill — matches image's solid green area */}
              <stop offset="5%" stopColor={color} stopOpacity={0.6} />
              <stop offset="95%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            tickFormatter={(v) => `${v}${unit}`}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: 'insideLeft',
                    offset: 12,
                    style: { fontSize: 12, fill: '#9ca3af' },
                  }
                : undefined
            }
          />
          <Tooltip
            formatter={(value) => [`${value}${unit}`, seriesLabel]}
            contentStyle={{
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              fontSize: 13,
            }}
          />
          <Legend
            align="right"
            verticalAlign="top"
            iconType="plainline"
            iconSize={16}
            wrapperStyle={{ fontSize: 13, paddingBottom: 8 }}
            formatter={() => seriesLabel}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill="url(#fill-single)"
            dot={{ r: 3, fill: color }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  )
}