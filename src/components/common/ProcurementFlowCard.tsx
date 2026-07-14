import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  Clock,
} from "lucide-react";

interface ProcurementFlowCardProps {
  poActual?: number;
  poTarget?: number;
  receivingActual?: number;
  receivingTarget?: number;
  totalActual?: number;
}

interface StageNodeProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accent: "indigo" | "amber" | "emerald";
  pulse?: boolean;
}

const accentStyles = {
  indigo: {
    ring: "ring-indigo-200",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    dot: "bg-indigo-500",
  },
  amber: {
    ring: "ring-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  emerald: {
    ring: "ring-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
} as const;

function StageNode({ icon, title, subtitle, accent, pulse }: StageNodeProps) {
  const styles = accentStyles[accent];
  return (
    <div className="flex md:flex-col items-center gap-2.5 md:text-center md:w-24 lg:w-28 flex-shrink-0">
      <div
        className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl ${styles.bg} ${styles.text} ring-1 ${styles.ring}`}
      >
        {icon}
        {pulse && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${styles.dot} border-2 border-white`}
            />
          </span>
        )}
      </div>
      <div className="text-left md:text-center">
        <p className="text-sm font-bold text-slate-800 tracking-tight">
          {title}
        </p>
        <p className="text-xs font-medium text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

interface ConnectorProps {
  label: string;
  actual: number;
  target: number;
  onTrack: boolean;
  variant: "solid" | "dashed";
}

function ConnectorStat({
  label,
  actual,
  target,
  onTrack,
  variant,
}: ConnectorProps) {
  const delta = actual - target;
  return (
    <>
      {/* Desktop: horizontal connector */}
      <div className="hidden md:flex flex-1 flex-col justify-center min-w-0">
        <div className="text-center mb-1">
          <span className="text-xs lg:text-sm font-bold uppercase tracking-widest text-slate-400">
            {label}
          </span>
        </div>
        <div className="relative w-full h-0.5 my-2 bg-slate-200">
          <div
            className={`absolute left-0 right-4 top-1/2 -translate-y-1/2 border-t-2 ${
              variant === "dashed"
                ? "border-dashed border-slate-300"
                : "border-solid border-slate-300"
            }`}
          />
          <ArrowRight
            strokeWidth={3}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300"
          />
        </div>
        <div className="text-center space-y-1 mt-1">
          <p
            className={`text-base lg:text-lg font-extrabold ${onTrack ? "text-emerald-600" : "text-rose-600"}`}
          >
            {actual.toFixed(1)} Hari
          </p>
          <p className="text-xs lg:text-sm text-slate-500 font-medium">
            Target {target.toFixed(1)} Hari, {Math.abs(delta).toFixed(1)}{" "}
            {onTrack ? "Lebih Cepat" : "Melebihi"}
          </p>
        </div>
      </div>

      {/* Mobile: vertical connector */}
      <div className="flex md:hidden items-stretch min-h-[80px] py-1">
        <div className="w-12 flex flex-col items-center flex-shrink-0 relative">
          <div
            className={`absolute top-0 bottom-4 left-1/2 -translate-x-1/2 border-l-2 ${
              variant === "dashed"
                ? "border-dashed border-slate-300"
                : "border-solid border-slate-300"
            }`}
          />
          <ArrowDown
            strokeWidth={3}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 text-slate-300"
          />
        </div>
        <div className="pl-3 flex-1 flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {label}
          </p>
          <p
            className={`text-base font-extrabold mt-0.5 ${onTrack ? "text-emerald-600" : "text-rose-600"}`}
          >
            {actual.toFixed(1)} Hari
          </p>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Target {target.toFixed(1)} Hari, {Math.abs(delta).toFixed(1)}{" "}
            {onTrack ? "Lebih Cepat" : "Melebihi"}
          </p>
        </div>
      </div>
    </>
  );
}

export function ProcurementFlowCard({
  poActual = 3.5,
  poTarget = 6.0,
  receivingActual = 7.0,
  receivingTarget = 8.0,
  totalActual = 10.5,
}: ProcurementFlowCardProps) {
  const isPoOnTrack = poActual <= poTarget;
  const isReceivingOnTrack = receivingActual <= receivingTarget;
  const allOnTrack = isPoOnTrack && isReceivingOnTrack;
  const onTrackCount = [isPoOnTrack, isReceivingOnTrack].filter(Boolean).length;

  return (
    <Card className="p-0 m-0 overflow-hidden rounded-2xl bg-white border border-slate-200/60 shadow-sm">
      <CardContent className="p-6">
        {/* Header inside the card */}
        <div className="flex flex-row items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 flex items-center justify-center rounded-xl p-2 bg-indigo-50 text-indigo-600">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                Average Procurement Cycle Time
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight leading-none">
                  {totalActual != null ? totalActual.toFixed(1) : "-"}
                </span>
                <span className="text-sm font-medium text-slate-500">Hari</span>
              </div>
            </div>
          </div>
          <Badge
            className={`rounded-full text-[11px] font-bold px-3 py-1 border-0 whitespace-nowrap ${
              allOnTrack
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {onTrackCount}/2 on track
          </Badge>
        </div>

        {/* Desktop: horizontal flow */}
        <div className="hidden md:flex flex-row items-center gap-2 py-2 lg:gap-4 justify-between">
          <StageNode
            icon={<FileText className="w-5 h-5 lg:w-6 lg:h-6" />}
            title="Finalized PR"
            subtitle="PR disetujui"
            accent="indigo"
            pulse
          />

          <ConnectorStat
            label="PO CYCLE TIME"
            actual={poActual}
            target={poTarget}
            onTrack={isPoOnTrack}
            variant="dashed"
          />

          <StageNode
            icon={<FileSpreadsheet className="w-5 h-5 lg:w-6 lg:h-6" />}
            title="Issued PO"
            subtitle="PO diterbitkan"
            accent="amber"
          />

          <ConnectorStat
            label="RECEIVING CYCLE TIME"
            actual={receivingActual}
            target={receivingTarget}
            onTrack={isReceivingOnTrack}
            variant="solid"
          />

          <StageNode
            icon={<CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6" />}
            title="Receiving"
            subtitle="Barang diterima"
            accent="emerald"
          />
        </div>

        {/* Mobile: vertical flow */}
        <div className="flex md:hidden flex-col gap-0">
          <StageNode
            icon={<FileText className="w-5 h-5" />}
            title="Finalized PR"
            subtitle="PR disetujui"
            accent="indigo"
            pulse
          />

          <ConnectorStat
            label="PO CYCLE TIME"
            actual={poActual}
            target={poTarget}
            onTrack={isPoOnTrack}
            variant="dashed"
          />

          <StageNode
            icon={<FileSpreadsheet className="w-5 h-5" />}
            title="Issued PO"
            subtitle="PO diterbitkan"
            accent="amber"
          />

          <ConnectorStat
            label="RECEIVING CYCLE TIME"
            actual={receivingActual}
            target={receivingTarget}
            onTrack={isReceivingOnTrack}
            variant="solid"
          />

          <StageNode
            icon={<CheckCircle2 className="w-5 h-5" />}
            title="Receiving"
            subtitle="Barang diterima"
            accent="emerald"
          />
        </div>
      </CardContent>

      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 sm:px-5">
        <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          Rata-rata waktu pengadaan dari PR difinalisasi s/d barang/jasa
          diterima
        </p>
      </div>
    </Card>
  );
}
