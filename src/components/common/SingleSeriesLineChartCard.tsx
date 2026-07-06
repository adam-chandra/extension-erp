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
  /** Optional subtitle/remarks text below the title */
  remarks?: string;
  /** If provided, draws a dashed horizontal reference line at this Y value */
  targetValue?: number;
  /** Label for the target line shown in the legend */
  targetLabel?: string;
  /** Color of the target reference line */
  targetColor?: string;
  /** If true, shows the actual value as a label above each data point */
  showDataLabels?: boolean;
}

interface DataPointLabelProps {
  x?: number | string;
  y?: number | string;
  value?: number | string;
}

interface LegendPayloadItem {
  value: string;
  type: "line" | "plainline";
  color: string;
}

// Custom label renderer — displays value above each dot
const DataPointLabel = (props: DataPointLabelProps) => {
  const { x, y, value } = props;
  if (value == null || typeof x !== "number" || typeof y !== "number") return null;
  return (
    <text
      x={x}
      y={y - 12}
      fill="#374151"
      textAnchor="middle"
      fontSize={12}
      fontWeight={600}
    >
      {Number(value).toFixed(1)}
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
}: SingleSeriesLineChartCardProps) {
  const showMenu = (cardId && module) || customMenu;

  // Build legend payload — include target entry when targetValue is set
  const legendPayload: LegendPayloadItem[] | undefined =
    targetValue != null
      ? [
          { value: seriesLabel, type: "line", color },
          {
            value: targetLabel || `Target (≤ ${targetValue.toFixed(1)})`,
            type: "plainline",
            color: targetColor,
          },
        ]
      : undefined;

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
                cardType="singleLine"
                cardData={{ title, seriesLabel, color, yAxisLabel, unit, data }}
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
              tick={{ fontSize: 12, fill: "#9ca3af" }}
            />
            <YAxis
              width={60}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickFormatter={(v) => `${v}${unit}`}
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
              formatter={(value) => [`${value}${unit}`, seriesLabel]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
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
              content={
                legendPayload
                  ? () => (
                      <div className="flex justify-end gap-4 pb-2 text-[13px]">
                        {legendPayload.map((entry) => (
                          <span
                            key={entry.value}
                            className="inline-flex items-center gap-1.5"
                          >
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
                            <span className="text-slate-600">
                              {entry.value}
                            </span>
                          </span>
                        ))}
                      </div>
                    )
                  : undefined
              }
            />
            {/* Target reference line (dashed) — only if targetValue provided */}
            {targetValue != null && (
              <ReferenceLine
                y={targetValue}
                stroke={targetColor}
                strokeDasharray="6 4"
                strokeWidth={2}
              />
            )}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill="url(#fill-single)"
              dot={{
                r: showDataLabels ? 5 : 3,
                fill: color,
                stroke: "#fff",
                strokeWidth: showDataLabels ? 2 : 0,
              }}
              activeDot={{ r: showDataLabels ? 7 : 5 }}
              label={showDataLabels ? <DataPointLabel /> : undefined}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
