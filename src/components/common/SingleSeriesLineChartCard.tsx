import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { CardMenu } from "./CardMenu";

interface DataPoint {
  label: string;
  value: number;
}

interface SingleSeriesLineChartCardProps {
  title: string;
  seriesLabel: string;
  color?: string;
  yAxisLabel?: string;
  unit?: string;
  data: DataPoint[];
  cardId?: string;
  module?: "central-dashboard" | "procurement" | "accounting" | "hris";
  customMenu?: React.ReactNode;
  remarks?: string;
  targetValue?: number;
  targetLabel?: string;
  targetColor?: string;
  showDataLabels?: boolean;
  yAxisTickInterval?: number;
}

interface LegendPayloadItem {
  value: string;
  type: "line" | "plainline";
  color: string;
}

interface DataPointLabelProps {
  x?: number | string;
  y?: number | string;
  value?: number | string;
  targetValue?: number;
}

interface CustomLegendContentProps {
  payload: LegendPayloadItem[];
}

function CustomLegendContent({ payload }: Readonly<CustomLegendContentProps>) {
  return (
    <div className="flex justify-end gap-4 pb-2 text-[11px] font-semibold text-slate-500">
      {payload.map((entry) => (
        <span key={entry.value} className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-0.5 w-4"
            style={{
              backgroundColor: entry.color,
              borderTop:
                entry.type === "plainline"
                  ? `2px dashed ${entry.color}`
                  : undefined,
            }}
          />
          <span>{entry.value}</span>
        </span>
      ))}
    </div>
  );
}

const DataPointLabel = (props: DataPointLabelProps) => {
  const { x, y, value, targetValue } = props;
  if (value == null || typeof x !== "number" || typeof y !== "number")
    return null;
  const numValue = Number(value);
  const isExceeded = targetValue != null && numValue > targetValue;
  return (
    <text
      x={x}
      y={y - 10}
      fill={isExceeded ? "#e11d48" : "#475569"}
      textAnchor="middle"
      fontSize={10}
      fontWeight={700}
    >
      {numValue.toFixed(1)}
    </text>
  );
};

export function SingleSeriesLineChartCard({
  title,
  seriesLabel,
  color = "#4ade80",
  yAxisLabel,
  unit = "%",
  data,
  cardId,
  module,
  customMenu,
  remarks,
  targetValue,
  targetLabel,
  targetColor = "#f59e0b",
  showDataLabels = false,
  yAxisTickInterval,
}: Readonly<SingleSeriesLineChartCardProps>) {
  const showMenu = (cardId && module) || customMenu;

  let computedTicks: number[] | undefined;
  let domain: [number, number] | undefined = undefined;
  if (yAxisTickInterval) {
    let maxVal = targetValue ?? 0;
    data.forEach((d) => {
      if (d.value > maxVal) maxVal = d.value;
    });
    const maxTick = Math.ceil(maxVal / yAxisTickInterval) * yAxisTickInterval;
    const finalMax = Math.max(maxTick, yAxisTickInterval * 4);
    computedTicks = [];
    for (let i = 0; i <= finalMax; i += yAxisTickInterval) {
      computedTicks.push(i);
    }
    domain = [0, finalMax];
  }

  const legendPayload: LegendPayloadItem[] | undefined =
    targetValue != null
      ? [
          { value: seriesLabel, type: "line", color },
          {
            value: targetLabel ?? `Target (≤ ${targetValue.toFixed(1)})`,
            type: "plainline",
            color: targetColor,
          },
        ]
      : undefined;

  const legendContent = useMemo(() => {
    if (!legendPayload) return undefined;
    return <CustomLegendContent payload={legendPayload} />;
  }, [legendPayload]);

  return (
    <div className="relative rounded-2xl bg-white border border-slate-100 px-5 pt-5 pb-3 shadow-sm hover:shadow-md transition-all duration-300 w-full overflow-hidden flex flex-col h-full group">
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
                cardType="singleLine"
                cardData={{ title, seriesLabel, color, yAxisLabel, unit, data }}
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
              <linearGradient
                id={`fill-single-${title.replace(/\s+/g, "")}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
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
              tickFormatter={(v) => `${v}`}
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
              formatter={(value) => [`${value}${unit}`, seriesLabel]}
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
            />

            <Legend
              align="right"
              verticalAlign="top"
              iconType="plainline"
              iconSize={16}
              wrapperStyle={{ fontSize: 11, top: -25, right: 0 }}
              formatter={() => seriesLabel}
              content={legendContent}
            />
            {targetValue != null && (
              <ReferenceLine
                y={targetValue}
                stroke={targetColor}
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            )}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              fill={`url(#fill-single-${title.replace(/\s+/g, "")})`}
              dot={{
                r: showDataLabels ? 4 : 3,
                fill: "#fff",
                stroke: color,
                strokeWidth: 2.5,
              }}
              activeDot={{
                r: 6,
                fill: color,
                stroke: "#fff",
                strokeWidth: 2,
              }}
              label={
                showDataLabels ? (
                  <DataPointLabel targetValue={targetValue} />
                ) : undefined
              }
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}