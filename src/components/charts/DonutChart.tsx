import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface DataItem {
  readonly label: string
  readonly value: number
  readonly color: string
  readonly icon?: React.ReactNode
}

interface DonutChartProps {
  readonly data: DataItem[]
  readonly totalLabel?: string
  readonly valueFormatter?: (value: number) => string
  readonly innerRadius?: number
  readonly outerRadius?: number
  readonly paddingAngle?: number
  readonly showPercentageOnChart?: boolean
  readonly className?: string
  readonly centerText?: string
  readonly centerSubtext?: string
  readonly onSegmentClick?: (data: DataItem, index: number) => void
  readonly chartWidth?: number
  readonly chartHeight?: number
  readonly labelFontSize?: number
  readonly labelColor?: string
}

export function DonutChart({
  data,
  totalLabel = 'Total',
  valueFormatter = (value) => value.toLocaleString('id-ID'),
  innerRadius = 60,
  outerRadius = 85,
  paddingAngle = 2,
  showPercentageOnChart = false,
  className = '',
  centerText,
  centerSubtext,
  onSegmentClick,
  chartWidth = 200,
  chartHeight = 200,
  labelFontSize = 12,
  labelColor = '#FFFFFF',
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  const handleSegmentClick = (entry: any, index: number) => {
    if (onSegmentClick) {
      const dataItem = data.find((item) => item.label === entry.label)
      if (dataItem) {
        onSegmentClick(dataItem, index)
      }
    }
  }

  // Custom label untuk menampilkan persentase DI DALAM donut
  const renderPercentageLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius: innerRad,
    outerRadius: outerRad,
    value,
  }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRad + (outerRad - innerRad) / 2
    const x = cx + radius * Math.cos(-(midAngle || 0) * RADIAN)
    const y = cy + radius * Math.sin(-(midAngle || 0) * RADIAN)
    
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
    
    return (
      <text
        x={x}
        y={y}
        fill={labelColor}
        textAnchor="middle"
        dominantBaseline="central"
        className="font-bold"
        style={{ 
          fontSize: `${labelFontSize}px`,
          textShadow: '0 1px 3px rgba(0,0,0,0.3)'
        }}
      >
        {percentage}%
      </text>
    )
  }

  return (
    <div 
      className={`relative shrink-0 ${className}`} 
      style={{ width: chartWidth, height: chartHeight }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            dataKey="value"
            onClick={handleSegmentClick}
            label={showPercentageOnChart ? renderPercentageLabel : undefined}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell 
                key={entry.label} 
                fill={entry.color}
                className="transition-opacity hover:opacity-80 cursor-pointer"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-xs text-gray-500 font-medium">
          {centerSubtext || totalLabel}
        </div>
        <div className="text-2xl font-bold text-gray-800 mt-1">
          {centerText || valueFormatter(total)}
        </div>
      </div>
    </div>
  )
}