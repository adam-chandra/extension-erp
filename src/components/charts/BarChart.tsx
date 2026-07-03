import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export interface BarChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface BarChartProps {
  readonly data: BarChartData[];
  readonly dataKey?: string;
  readonly fill?: string;
  readonly barSize?: number;
  readonly height?: number;
  readonly showLabels?: boolean;
  readonly gradient?: boolean;
  readonly animated?: boolean;
  readonly className?: string;
  readonly xAxisAngle?: number;
  readonly showGrid?: boolean;
  readonly borderRadius?: number;
  readonly showYAxis?: boolean;
  readonly showXAxis?: boolean;
}

// Custom label untuk bar
const CustomBarLabel = (props: any) => {
  const { x, y, width, height, value } = props;

  if (value === 0 || !value) return null;

  const isPositive = value >= 0;
  const labelY = isPositive ? y - 8 : y + height + 20;

  return (
    <text
      x={x + width / 2}
      y={labelY}
      fill="#6b7280"
      textAnchor="middle"
      fontSize={12}
      fontWeight={600}
    >
      {value.toLocaleString("id-ID")}
    </text>
  );
};

// Custom shape untuk bar dengan border radius
const CustomBarShape = (props: any) => {
  const { x, y, width, height, fill, borderRadius = 6 } = props;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      rx={borderRadius}
      ry={borderRadius}
      className="transition-all duration-300 hover:opacity-80"
    />
  );
};

// Palet gradient
const GRADIENT_COLORS = {
  purple: ["#667eea", "#764ba2"],
  blue: ["#4facfe", "#00f2fe"],
  green: ["#43e97b", "#38f9d7"],
  orange: ["#fa709a", "#fee140"],
  pink: ["#f093fb", "#f5576c"],
  teal: ["#4facfe", "#00f2fe"],
  red: ["#ff6b6b", "#ee5a24"],
  yellow: ["#f9ca24", "#f0932b"],
};

export function BarChart({
  data,
  dataKey = "value",
  fill = "#8884d8",
  barSize = 40,
  height = 320,
  showLabels = true,
  gradient = true,
  animated = true,
  className = "",
  xAxisAngle = -15,
  showGrid = true,
  borderRadius = 6,
  showYAxis = true,
  showXAxis = true,
}: BarChartProps) {
  // Pilih gradient berdasarkan fill
  const getGradientColors = () => {
    if (fill === "#8884d8") return GRADIENT_COLORS.purple;
    if (fill === "#82ca9d") return GRADIENT_COLORS.green;
    if (fill === "#ffc658") return GRADIENT_COLORS.orange;
    if (fill === "#ff8042") return GRADIENT_COLORS.pink;
    if (fill === "#4facfe") return GRADIENT_COLORS.blue;
    if (fill === "#ff6b6b") return GRADIENT_COLORS.red;
    if (fill === "#f9ca24") return GRADIENT_COLORS.yellow;
    return [fill, fill];
  };

  const [color1, color2] = getGradientColors();
  const gradientId = `gradient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart
          data={data}
          margin={{ top: 20, right: 12, left: 4, bottom: 20 }}
        >
          {/* Gradient Definitions */}
          <defs>
            {gradient && (
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color1} stopOpacity={0.9} />
                <stop offset="100%" stopColor={color2} stopOpacity={0.7} />
              </linearGradient>
            )}
          </defs>

          {/* Grid */}
          {showGrid && (
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#f0f0f0"
              vertical={false}
            />
          )}

          {/* X Axis */}
          {showXAxis && (
            <XAxis
              dataKey="name"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={{ stroke: "#e5e7eb" }}
              axisLine={{ stroke: "#e5e7eb" }}
              interval={0}
              angle={xAxisAngle}
              textAnchor={xAxisAngle < 0 ? "end" : "middle"}
              height={xAxisAngle === 0 ? 28 : 60}
            />
          )}

          {/* Y Axis */}
          {showYAxis && (
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={{ stroke: "#e5e7eb" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickFormatter={(value) => value.toLocaleString("id-ID")}
              width={60}
            />
          )}

          {/* Bar */}
          <Bar
            dataKey={dataKey}
            fill={gradient ? `url(#${gradientId})` : fill}
            barSize={barSize}
            radius={[borderRadius, borderRadius, 0, 0]}
            animationDuration={animated ? 1000 : 0}
            animationEasing="ease-in-out"
            label={showLabels ? <CustomBarLabel /> : false}
            shape={(props: any) => (
              <CustomBarShape {...props} borderRadius={borderRadius} />
            )}
          />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}