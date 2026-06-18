import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { CardMenu } from './CardMenu'

interface DataItem {
  readonly label: string
  readonly value: number
  readonly color: string
  readonly icon?: React.ReactNode
}

interface DonutChartCardProps {
  readonly title: string
  readonly data: DataItem[]
  readonly totalLabel?: string
  readonly valueFormatter?: (value: number) => string
  readonly cardId?: string
  readonly module?: 'central-dashboard' | 'procurement' | 'accounting' | 'hris'
  readonly customMenu?: React.ReactNode
}

export function DonutChartCard({
  title,
  data,
  totalLabel = 'Total',
  valueFormatter = (value) => value.toLocaleString('id-ID'),
  cardId,
  module,
  customMenu,
}: DonutChartCardProps) {
  const showMenu = (cardId && module) || customMenu
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="relative rounded-2xl bg-white px-5 pt-4 pb-4 shadow-md w-full overflow-hidden flex flex-col h-full">
      {/* Header with title and menu */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-base font-semibold text-gray-800 flex-1 min-w-0 line-clamp-2">
          {title}
        </h3>
        {showMenu && (
          <div className="flex-shrink-0 -mt-1">
            {customMenu || (
              cardId && (
                <CardMenu
                  cardId={cardId}
                  cardType="pie"
                  cardData={{ title, data, totalLabel }}
                />
              )
            )}
          </div>
        )}
      </div>

      <div className="flex-1 flex items-center gap-6 min-h-[280px]">
        {/* Donut Chart */}
        <div className="relative flex-shrink-0" style={{ width: '200px', height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.label}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text - Total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-xs text-gray-500 font-medium">{totalLabel}</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {valueFormatter(total)}
            </div>
          </div>
        </div>

        {/* Legend with Icons */}
        <div className="flex-1 flex flex-col gap-3">
          {data.map((item) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0'
            
            return (
              <div key={item.label} className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  {item.icon ? (
                    <div style={{ color: item.color }}>{item.icon}</div>
                  ) : (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                </div>

                {/* Label and Value */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {item.label}
                    </span>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {percentage}%
                    </span>
                  </div>
                  <div className="text-base font-semibold text-gray-800 mt-0.5">
                    {valueFormatter(item.value)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
