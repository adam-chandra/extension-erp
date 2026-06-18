import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { CardMenu } from './CardMenu'

interface PieSlice {
  label: string
  value: number  // angka persentase, misal: 30
  color: string
}

interface PieChartCardProps {
  title: string
  data: PieSlice[]
  unit?: string  // default '%'
  cardId?: string
  module?: 'central-dashboard' | 'procurement' | 'accounting' | 'hris'
  customMenu?: React.ReactNode
}

const RADIAN = Math.PI / 180

function renderCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  label,
  value,
  unit,
}: {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  label: string
  value: number
  unit: string
}) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.58
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fill="white"
      fontSize={12}
      fontWeight="600"
    >
      <tspan x={x} dy="-0.6em">{label}</tspan>
      <tspan x={x} dy="1.4em" fontSize={15} fontWeight="700">
        {value}{unit}
      </tspan>
    </text>
  )
}

export function PieChartCard({
  title,
  data,
  unit = '%',
  cardId,
  module,
  customMenu,
}: PieChartCardProps) {
  const showMenu = (cardId && module) || customMenu

  return (
    <div className="relative rounded-2xl bg-white px-5 pt-4 pb-3 shadow-md w-full overflow-hidden flex flex-col h-full">
      {/* Header with title and menu */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-base font-semibold text-gray-800 flex-1 min-w-0 line-clamp-2">{title}</h3>
        {showMenu && (
          <div className="flex-shrink-0 -mt-1">
            {customMenu || (
              <CardMenu
                cardId={cardId!}
                cardType="pie"
                cardData={{ title, data, unit }}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Shadow layer */}
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="54%"
            outerRadius={108}
            innerRadius={0}
            startAngle={90}
            endAngle={-270}
            isAnimationActive={false}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`shadow-${index}`}
                fill={entry.color}
                opacity={0.3}
                style={{ filter: 'blur(5px)' }}
              />
            ))}
          </Pie>

          {/* Main pie */}
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={108}
            innerRadius={0}
            startAngle={90}
            endAngle={-270}
            stroke="white"
            strokeWidth={2}
            label={(props) =>
              renderCustomLabel({
                cx: Number(props.cx),
                cy: Number(props.cy),
                midAngle: props.midAngle ?? 0,
                innerRadius: Number(props.innerRadius),
                outerRadius: Number(props.outerRadius),
                label: (props.payload as PieSlice)?.label ?? '',
                value: (props.payload as PieSlice)?.value ?? 0,
                unit,
              })
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => [`${value}${unit}`, '']}
            contentStyle={{
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              fontSize: 13,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      </div>
    </div>
  )
}