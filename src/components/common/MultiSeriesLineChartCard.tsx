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
  yAxisFormatter?: (value: number, index: number) => string;
  /** Fixed interval for Y axis ticks */
  yAxisTickInterval?: number;
}

interface MultiDataPointLabelProps {
  x?: number | string;
  y?: number | string;
  value?: number | string;
  suffix?: string;
}

// Custom legend renderer — displays line style (solid / dashed) per series.
// Defined outside the parent component so React treats it as a stable type.
interface SeriesLegendProps {
  series: Series[]
}

function SeriesLegend({ series }: Readonly<SeriesLegendProps>) {
  return (
    <div className="flex justify-end gap-4 pb-2 text-[13px]">
      {series.map((s) => (
        <span key={s.key} className="inline-flex items-center gap-1.5">
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
}

// Custom label renderer — displays value above each dot
const MultiDataPointLabel = (props: MultiDataPointLabelProps) => {
  const { x, y, value, suffix = "" } = props;
  if (value == null || typeof x !== "number" || typeof y !== "number")
    return null;
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
  yAxisTickInterval,
}: Readonly<MultiSeriesLineChartCardProps>) {
  const showMenu = (cardId && module) || customMenu;

  const hasDashedSeries = series.some((s) => s.dashed);

  let computedTicks: number[] | undefined;
  let domain: [number, number] | undefined;
  if (yAxisTickInterval) {
    let maxVal = 0;
    data.forEach((d) => {
      series.forEach((s) => {
        const val = Number(d[s.key]);
        if (!Number.isNaN(val) && val > maxVal) {
          maxVal = val;
        }
      });
    });
    const maxTick = Math.ceil(maxVal / yAxisTickInterval) * yAxisTickInterval;
    const finalMax = Math.max(maxTick, yAxisTickInterval * 4); // ensure at least some ticks
    computedTicks = [];
    for (let i = 0; i <= finalMax; i += yAxisTickInterval) {
      computedTicks.push(i);
    }
    domain = [0, finalMax];
  }

  return (
    <div className="relative rounded-2xl bg-white border border-slate-100 px-5 pt-5 pb-3 shadow-sm hover:shadow-md transition-all duration-300 w-full overflow-hidden flex flex-col h-full group">
      {/* Header with title and menu */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight leading-tight">
            {title}
          </h3>
          {remarks && (
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1 leading-normal">
              {remarks}
            </p>
          )}
        </div>
        {showMenu && (
          <div className="shrink-0 -mt-1.5">
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

      <div className="flex-1 min-h-62.5 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: showDataLabels ? 20 : 10,
              right: 16,
              left: yAxisLabel ? 15 : -10,
              bottom: 0,
            }}
          >
            <defs>
              {series.map((s) => (
                <linearGradient
                  key={s.key}
                  id={`fill-${s.key}-${title.replace(/\s+/g, "")}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={s.color}
                    stopOpacity={s.dashed ? 0.05 : 0.2}
                  />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0.0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              width={35}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
              tickFormatter={yAxisFormatter ?? String}
              ticks={computedTicks}
              domain={domain}
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: "insideLeft",
                      offset: -5,
                      style: {
                        fontSize: 11,
                        fill: "#94a3b8",
                        fontWeight: 600,
                        textAnchor: "middle",
                      },
                    }
                  : undefined
              }
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                backgroundColor: "rgba(255, 255, 255, 0.96)",
                backdropFilter: "blur(4px)",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
                fontSize: 12,
                fontWeight: 500,
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
              wrapperStyle={{ fontSize: 11, top: -25, right: 0 }}
              formatter={(value) =>
                series.find((s) => s.key === value)?.label ?? value
              }
              content={hasDashedSeries ? <SeriesLegend series={series} /> : undefined}
            />
            {series.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.key}
                stroke={s.color}
                strokeWidth={3}
                strokeDasharray={s.dashed ? "5 5" : undefined}
                fill={`url(#fill-${s.key}-${title.replace(/\s+/g, "")})`}
                dot={{
                  r: showDataLabels ? 4 : 3,
                  fill: "#fff",
                  stroke: s.color,
                  strokeWidth: 2.5,
                }}
                activeDot={{
                  r: 6,
                  fill: s.color,
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
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
