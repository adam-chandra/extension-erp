import type { MetricType, DocumentRow } from "@/types/procurement";
import type { DataTableColumnDef } from "@/components/common/DataTable";

export type ProcurementCardId =
  | "proc-tile-pr-no-po"
  | "proc-tile-po-incomplete"
  | "proc-tile-po-no-receiving"
  | "proc-tile-po-cycle-time"
  | "proc-tile-receiving-cycle-time"
  | "proc-tile-procurement-cycle-time"
  | "proc-tile-cost-saving"
  | "proc-tile-saving-rate"
  | "proc-tile-otd-rate";

export const cardIdToMetric: Record<ProcurementCardId, MetricType> = {
  "proc-tile-pr-no-po": "pr_no_po",
  "proc-tile-po-incomplete": "po_incomplete",
  "proc-tile-po-no-receiving": "po_no_receiving",
  "proc-tile-po-cycle-time": "po_cycle_time",
  "proc-tile-receiving-cycle-time": "receiving_cycle_time",
  "proc-tile-procurement-cycle-time": "procurement_cycle_time",
  "proc-tile-cost-saving": "cost_saving",
  "proc-tile-saving-rate": "saving_rate",
  "proc-tile-otd-rate": "otd_rate",
};

export interface MetricPageConfig {
  title: string;
  description: string;
}

export const metricPageConfig: Record<ProcurementCardId, MetricPageConfig> = {
  "proc-tile-pr-no-po": {
    title: "Detail PR Belum Dibuatkan PO",
    description: "Daftar purchase request yang belum menjadi purchase order.",
  },
  "proc-tile-po-incomplete": {
    title: "Detail PO Belum Diterbitkan",
    description:
      "Daftar purchase order yang masih draft atau menunggu approval.",
  },
  "proc-tile-po-no-receiving": {
    title: "Detail PO Belum Ada Receiving",
    description:
      "Daftar purchase order yang sudah diterbitkan namun belum ada penerimaan barang/jasa.",
  },
  "proc-tile-po-cycle-time": {
    title: "Detail Average PO Cycle Time",
    description: "Daftar PR dan PO untuk melihat durasi penerbitan PO.",
  },
  "proc-tile-receiving-cycle-time": {
    title: "Detail Average Receiving Cycle Time",
    description: "Daftar PO dan receiving untuk melihat durasi penerimaan.",
  },
  "proc-tile-procurement-cycle-time": {
    title: "Detail Average Procurement Cycle Time",
    description: "Daftar PR, PO, dan receiving untuk melihat total durasi pengadaan.",
  },
  "proc-tile-cost-saving": {
    title: "Detail Cost Savings",
    description: "Daftar PR dan PO yang menghasilkan nilai saving.",
  },
  "proc-tile-saving-rate": {
    title: "Detail Saving Rate",
    description: "Daftar PR dan PO untuk validasi persentase saving.",
  },
  "proc-tile-otd-rate": {
    title: "Detail On-Time Delivery Rate",
    description: "Daftar PO untuk validasi ketepatan waktu penerimaan.",
  },
};

export const DEFAULT_CARD_ID: ProcurementCardId = "proc-tile-pr-no-po";

export function getCardId(raw: string | null): ProcurementCardId {
  if (raw && raw in cardIdToMetric) return raw as ProcurementCardId;
  return DEFAULT_CARD_ID;
}

// ── Formatting & Badges ──────────────────────────────────────────

const stateColorMap: Record<string, { bg: string; text: string }> = {
  draft: { bg: "bg-slate-100", text: "text-slate-700" },
  confirmed: { bg: "bg-blue-100", text: "text-blue-700" },
  approved: { bg: "bg-emerald-100", text: "text-emerald-700" },
  done: { bg: "bg-green-100", text: "text-green-700" },
  cancel: { bg: "bg-red-100", text: "text-red-700" },
  purchase: { bg: "bg-indigo-100", text: "text-indigo-700" },
  to_approve: { bg: "bg-amber-100", text: "text-amber-700" },
  sent: { bg: "bg-sky-100", text: "text-sky-700" },
};

function StateBadge({ state }: { state: string }) {
  const colors = stateColorMap[state.toLowerCase()] ?? {
    bg: "bg-slate-100",
    text: "text-slate-600",
  };
  const label = state
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}
    >
      {label}
    </span>
  );
}

function formatCurrency(value: unknown) {
  if (typeof value !== "number") return "-";
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatDate(value: unknown) {
  if (typeof value !== "string" || !value) return "-";
  try {
    return new Date(value).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(value);
  }
}

function formatDays(value: unknown) {
  if (typeof value !== "number") return "-";
  return `${value.toFixed(1)} hari`;
}

function renderState(value: unknown) {
  if (typeof value !== "string" || !value) return "-";
  return <StateBadge state={value} />;
}

function renderBoolean(value: unknown) {
  if (value === true)
    return <span className="text-green-600 font-medium">Ya</span>;
  if (value === false) return <span className="text-gray-400">Tidak</span>;
  return "-";
}

// ── Columns ──────────────────────────────────────────────────────

export type ColDef = DataTableColumnDef<DocumentRow>;

export const prNoPOColumns: ColDef[] = [
  { key: "no", label: "No", width: "60px", align: "center" },
  { key: "name", label: "No Dokumen", width: "180px" },
  { key: "date", label: "Tanggal", width: "130px", render: formatDate },
  { key: "state", label: "Status", width: "140px", render: renderState },
  {
    key: "amount",
    label: "Nilai (Rp)",
    width: "160px",
    align: "right",
    render: formatCurrency,
  },
];

export const poIncompleteColumns: ColDef[] = [
  { key: "no", label: "No", width: "60px", align: "center" },
  { key: "name", label: "No PO", width: "180px" },
  { key: "date", label: "Tanggal PO", width: "130px", render: formatDate },
  { key: "state", label: "Status", width: "140px", render: renderState },
  {
    key: "amount",
    label: "Nilai PO (Rp)",
    width: "160px",
    align: "right",
    render: formatCurrency,
  },
  {
    key: "date_approve",
    label: "Tgl Approve",
    width: "130px",
    render: formatDate,
  },
  {
    key: "from_purchase_request",
    label: "Dari PR?",
    width: "90px",
    align: "center",
    render: renderBoolean,
  },
];

export const poNoReceivingColumns: ColDef[] = [
  { key: "no", label: "No", width: "60px", align: "center" },
  { key: "name", label: "No PO", width: "180px" },
  { key: "date", label: "Tanggal PO", width: "130px", render: formatDate },
  { key: "state", label: "Status", width: "140px", render: renderState },
  {
    key: "amount",
    label: "Nilai PO (Rp)",
    width: "160px",
    align: "right",
    render: formatCurrency,
  },
  { key: "date_planned", label: "ETA", width: "130px", render: formatDate },
  {
    key: "is_goods_orders",
    label: "Goods?",
    width: "90px",
    align: "center",
    render: renderBoolean,
  },
];

export const performanceColumns: ColDef[] = [
  { key: "no", label: "No", width: "60px", align: "center" },
  { key: "type", label: "Tipe", width: "70px", align: "center" },
  { key: "name", label: "No Dokumen", width: "180px" },
  { key: "date", label: "Tanggal", width: "130px", render: formatDate },
  { key: "state", label: "Status", width: "140px",render: renderState },
  {
    key: "pr_estimated_total",
    label: "Estimasi PR (Rp)",
    width: "170px",
    align: "right",
    render: formatCurrency,
  },
  {
    key: "amount_untaxed",
    label: "Nilai (Before Tax)",
    width: "170px",
    align: "right",
    render: formatCurrency,
  },
  {
    key: "amount",
    label: "Total (Rp)",
    width: "160px",
    align: "right",
    render: formatCurrency,
  },
  {
    key: "cycle_days",
    label: "Cycle Days",
    width: "110px",
    align: "right",
    render: formatDays,
  },
  {
    key: "amount_saved_from_cost_savings",
    label: "Savings (Rp)",
    width: "160px",
    align: "right",
    render: formatCurrency,
  },
];

export function getColumnsForMetric(cardId: ProcurementCardId): ColDef[] {
  switch (cardId) {
    case "proc-tile-pr-no-po":
      return prNoPOColumns;
    case "proc-tile-po-incomplete":
      return poIncompleteColumns;
    case "proc-tile-po-no-receiving":
      return poNoReceivingColumns;
    default:
      return performanceColumns;
  }
}
