import { cn, formatNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  FileText,
  Hourglass,
  RefreshCw,
  Search,
  Trash,
  User,
  type LucideIcon,
} from "lucide-react";

interface SectionCardProps {
  title: string;
  icon: LucideIcon;
  iconClassName?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const toneClassMap = {
  slate: "bg-slate-50 border-slate-100 text-slate-700",
  blue: "bg-blue-50/50 border-blue-100 text-blue-700",
  amber: "bg-amber-50/50 border-amber-100 text-amber-700",
  rose: "bg-rose-50/50 border-rose-100 text-rose-700",
  emerald: "bg-emerald-50/50 border-emerald-100 text-emerald-700",
} as const;

const statIconMap = {
  fileText: FileText,
  alertTriangle: AlertTriangle,
  search: Search,
  hourglass: Hourglass,
  trash: Trash,
  refreshCw: RefreshCw,
} as const;

export function SectionCard({
  title,
  icon: Icon,
  iconClassName,
  rightSlot,
  children,
  className,
}: SectionCardProps) {
  return (
    <Card className={cn("rounded-2xl border-slate-100 shadow-xs", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wide text-slate-700">
            <Icon className={cn("h-4 w-4", iconClassName)} />
            {title}
          </CardTitle>
          {rightSlot}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function DonutLegendList({
  items,
}: {
  items: { label: string; value: number; color: string; note?: string; percentageLabel?: string }[];
}) {
  return (
    <div className="space-y-3 text-xs">
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-2">
          <div className="mt-0.5 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          <div>
            <p className="font-semibold text-slate-700">
              {item.label}{" "}
              {item.note ? <span className="font-normal text-slate-400">{item.note}</span> : null}
            </p>
            <p className="text-slate-500">
              {formatNumber(item.value)}
              {item.percentageLabel ? ` (${item.percentageLabel})` : ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function OwnershipSummary({
  totalOwnersLabel,
  assignedPercentLabel,
  assignedProgress,
}: {
  totalOwnersLabel: string;
  assignedPercentLabel: string;
  assignedProgress: number;
}) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
        <User className="h-5 w-5 text-blue-500" />
        <div>
          <h4 className="text-base font-bold text-slate-900">{totalOwnersLabel}</h4>
          <p className="text-[10px] text-slate-400">Total Asset Owner</p>
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 p-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          {assignedPercentLabel}
        </div>
        <p className="mt-1 text-[10px] text-slate-400">Asset Sudah Ter-assign</p>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-blue-600" style={{ width: `${assignedProgress}%` }} />
        </div>
      </div>
    </div>
  );
}

export function DepartmentList({
  title,
  items,
}: {
  title: string;
  items: { label: string; valueLabel: string }[];
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase text-slate-500">{title}</p>
      <div className="space-y-1.5 text-xs">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex justify-between border-b border-slate-50 py-1 text-slate-600"
          >
            <span>{item.label}</span>
            <span className="font-medium">{item.valueLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatMiniCard({
  title,
  value,
  subtitle,
  icon,
  tone,
  progress,
  className,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: keyof typeof statIconMap;
  tone: keyof typeof toneClassMap;
  progress?: number;
  className?: string;
}) {
  const Icon = statIconMap[icon];
  const toneClass = toneClassMap[tone];

  return (
    <div
      className={cn(
        "relative flex h-28 flex-col justify-between rounded-xl border p-3",
        toneClass,
        className
      )}
    >
      <span className="text-[10px] font-bold uppercase">{title}</span>
      <div>
        <h3 className={cn("text-xl font-bold", tone === "slate" ? "text-slate-900" : "")}>{value}</h3>
        <p className="text-[10px] text-slate-500">{subtitle}</p>
      </div>

      {typeof progress === "number" ? (
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-blue-600" style={{ width: `${progress}%` }} />
        </div>
      ) : (
        <Icon className="absolute bottom-3 right-3 h-4 w-4" />
      )}
    </div>
  );
}

export function ProgressList({
  items,
}: {
  items: { label: string; progress: number; colorClass: string }[];
}) {
  return (
    <div className="space-y-3 text-xs">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between font-medium">
            <span>{item.label}</span>
            <span className="text-slate-600">{item.progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className={cn("h-full", item.colorClass)} style={{ width: `${item.progress}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LifecycleAverageAge({
  averageAgeLabel,
  averageAgeSubLabel,
}: {
  averageAgeLabel: string;
  averageAgeSubLabel: string;
}) {
  return (
    <div className="relative flex flex-col justify-between rounded-xl border border-purple-100 bg-purple-50/50 p-4">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-wider text-purple-700">Rata - Rata Umur Aset</p>
        <h3 className="mt-1 text-2xl font-black text-purple-950">{averageAgeLabel}</h3>
      </div>
      <p className="mt-2 text-[10px] text-slate-400">{averageAgeSubLabel}</p>
      <Calendar className="absolute right-4 top-4 h-5 w-5 text-purple-400" />
    </div>
  );
}
