import { Loader2 } from "lucide-react";
import ReportTreeTable, {
  type ReportColumn,
  type ReportRow,
} from "@/components/common/ReportTreeTable";
import type { DateFilter } from "@/hooks/useConsolidationFilters";

interface ReportBodyProps {
  columns: ReportColumn[];
  loading: boolean;
  error: string | null;
  reportRows: ReportRow[];
  dateFilter: DateFilter | null;
}

export function ReportBody({
  columns,
  loading,
  error,
  reportRows,
  dateFilter,
}: Readonly<ReportBodyProps>) {
  if (columns.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Pilih minimal satu company untuk menampilkan laporan.
      </div>
    );
  }

  if (!dateFilter) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Pilih periode untuk menampilkan laporan.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (reportRows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Tidak ada data untuk periode dan company yang dipilih.
      </div>
    );
  }

  return <ReportTreeTable columns={columns} data={reportRows} />;
}
