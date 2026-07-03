import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Palet warna icon. Tambahkan varian baru di sini kalau perlu warna lain.
 * Pola: bg-{color}-100 text-{color}-600 shadow-{color}-200
 */
const kpiColorMap = {
  blue: "bg-blue-100 text-blue-600 shadow-blue-200",
  emerald: "bg-emerald-100 text-emerald-600 shadow-emerald-200",
  teal: "bg-teal-100 text-teal-600 shadow-teal-200",
  amber: "bg-amber-100 text-amber-600 shadow-amber-200",
  rose: "bg-rose-100 text-rose-600 shadow-rose-200",
  purple: "bg-purple-100 text-purple-600 shadow-purple-200",
} as const;

export type KpiColor = keyof typeof kpiColorMap;

export interface KpiTrend {
  /** contoh: "5,2%" */
  value: string;
  direction: "up" | "down";
  /** contoh: "vs Des 2025" atau "dari total aset" */
  caption: string;
}

export interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unitLabel?: string;
  valueNote?: string;
  color: KpiColor;
  trend?: KpiTrend;
  className?: string;
}

/**
 * Atom: kartu KPI tunggal (icon + label + value + trend).
 * Dipakai berulang di grid dashboard, jadi semua styling terpusat di sini.
 */
export function SummaryCard({
  icon: Icon,
  label,
  value,
  unitLabel,
  valueNote,
  color,
  trend,
  className,
}: SummaryCardProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl border-slate-100 shadow-xs",
        className
      )}
    >
      <CardContent className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm",
            kpiColorMap[color]
          )}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <h3 className="text-xl font-bold text-slate-900">{value}</h3>
          {unitLabel ? <p className="text-[11px] text-slate-500">{unitLabel}</p> : null}
          {valueNote ? <p className="text-[10px] text-slate-400">{valueNote}</p> : null}

          {trend && (
            <p className="mt-0.5 text-xs text-slate-400">
              <span
                className={cn(
                  "font-medium",
                  trend.direction === "up" ? "text-emerald-500" : "text-rose-500"
                )}
              >
                {trend.direction === "up" ? "↗" : "↘"} {trend.value}
              </span>{" "}
              {trend.caption}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}