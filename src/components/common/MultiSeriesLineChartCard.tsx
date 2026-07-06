import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CardMenu } from "./CardMenu";

interface Series {
  key: string;
  label: string;
  color: string;
  /** If true, renders the line as dashed */
  dashed?: boolean;
}

interface DataPoint {
  label: string;
  [key: string]: number | string;
}

interface MultiSeriesLineChartCardProps {
  title: string;
  yAxisLabel?: string;
  series: Series[];
  data: DataPoint[];
  cardId?: string;
  module?: "central-dashboard" | "procurement" | "accounting" | "hris";
  customMenu?: React.ReactNode;
  /** Optional subtitle/remarks text below the title */
  remarks?: string;
  /** If true, shows the actual value as a label above each data point */
  showDataLabels?: boolean;
  /** Unit suffix for tooltip (default: 'M') */
  tooltipUnit?: string;
  /** Custom Y-axis tick formatter */
  yAxisFormatter?: (value: number) => string;
}

interface MultiDataPointLabelProps {
  x?: number | string;
  y?: number | string;
  value?: number | string;
  suffix?: string;
}

// Custom label renderer — displays value above each dot
const MultiDataPointLabel = (props: MultiDataPointLabelProps) => {
  const { x, y, value, suffix = "" } = props;
  if (value == null || typeof x !== "number" || typeof y !== "number") return null;
  return (
    <text
      x={x}
      y={y - 12}
      fill="#374151"
      textAnchor="middle"
      fontSize={11}
      fontWeight={600}
    >
      {typeof value === "number"
        ? `${value.toLocaleString("id-ID", { maximumFractionDigits: 1 })}${suffix}`
        : `${value}${suffix}`}
    </text>
  );
};

export function MultiSeriesLineChartCard({
  title,
  yAxisLabel,
  series,
  data,
  cardId,
  module,
  customMenu,
  remarks,
  showDataLabels = false,
  tooltipUnit = "M",
  yAxisFormatter,
}: MultiSeriesLineChartCardProps) {
  const showMenu = (cardId && module) || customMenu;

  const hasDashedSeries = series.some((s) => s.dashed);

  return (
    <div className="relative rounded-2xl bg-white px-5 pt-4 pb-2 shadow-md w-full overflow-hidden flex flex-col h-full">
      {/* Header with title and menu */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
            {title}
          </h3>
          {remarks && (
            <p className="text-xs text-gray-400 italic mt-0.5">{remarks}</p>
          )}
        </div>
        {showMenu && (
          <div className="flex-shrink-0 -mt-1">
            {customMenu || (
              <CardMenu
                cardId={cardId!}
                cardType="multiLine"
                cardData={{ title, yAxisLabel, series, data }}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: showDataLabels ? 24 : 4,
              right: 16,
              left: 20,
              bottom: 0,
            }}
          >
            <defs>
              {series.map((s) => (
                <linearGradient
                  key={s.key}
                  id={`fill-${s.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  {/* More opaque fill to match image — area clearly visible */}
                  <stop
                    offset="5%"
                    stopColor={s.color}
                    stopOpacity={s.dashed ? 0.1 : 0.45}
                  />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
            />
            <YAxis
              width={75}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickFormatter={yAxisFormatter}
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                      style: { fontSize: 12, fill: "#9ca3af", textAnchor: "middle" },
                    }
                  : undefined
              }
            />
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                fontSize: 13,
              }}
              formatter={(value, name) => [
                `${value}${tooltipUnit}`,
                series.find((s) => s.key === name)?.label ?? name,
              ]}
            />
            <Legend
              align="right"
              verticalAlign="top"
              iconType="plainline"
              iconSize={16}
              wrapperStyle={{ fontSize: 13, paddingBottom: 8 }}
              formatter={(value) =>
                series.find((s) => s.key === value)?.label ?? value
              }
              content={
                hasDashedSeries
                  ? () => (
                      <div className="flex justify-end gap-4 pb-2 text-[13px]">
                        {series.map((s) => (
                          <span
                            key={s.key}
                            className="inline-flex items-center gap-1.5"
                          >
                            <span
                              className="inline-block w-4"
                              style={{
                                borderTop: s.dashed
                                  ? `2px dashed ${s.color}`
                                  : `2px solid ${s.color}`,
                              }}
                            />
                            <span className="text-slate-600">{s.label}</span>
                          </span>
                        ))}
                      </div>
                    )
                  : undefined
              }
            />
            {series.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.key}
                stroke={s.color}
                strokeWidth={2}
                strokeDasharray={s.dashed ? "6 4" : undefined}
                fill={`url(#fill-${s.key})`}
                dot={{
                  r: showDataLabels ? 5 : 3,
                  fill: s.color,
                  stroke: "#fff",
                  strokeWidth: showDataLabels ? 2 : 0,
                }}
                activeDot={{ r: showDataLabels ? 7 : 5 }}
                label={
                  showDataLabels ? (
                    <MultiDataPointLabel suffix={tooltipUnit} />
                  ) : undefined
                }
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
