import { useCallback, useState } from "react";
import {
  consolidationService,
  type ConsolidationReportLine,
} from "@/services/consolidation.service";
import type { ReportRow } from "@/components/common/ReportTreeTable";
import type { DateFilter } from "./useConsolidationFilters";

type ReportType = "balance_sheet" | "profit_loss";

export function useConsolidationReport(
  dateFilter: DateFilter | null,
  selectedCompanies: string[],
  reportType: ReportType
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportRows, setReportRows] = useState<ReportRow[]>([]);

  const toReportRows = useCallback(
    (lines: ConsolidationReportLine[]): ReportRow[] =>
      lines.map((line) => ({
        id: line.id,
        coa: line.code,
        description: line.name,
        isSubtotal: line.isSubtotal,
        values: line.companyBalances,
        eliminationDebit: line.eliminationDebit,
        eliminationCredit: line.eliminationCredit,
        children: line.children ? toReportRows(line.children) : undefined,
      })),
    [],
  );

  const fetchReport = useCallback(async () => {
    if (!dateFilter || selectedCompanies.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const result = await consolidationService.getReport({
        companyIds: selectedCompanies.map(Number),
        startDate: dateFilter.startDate,
        endDate: dateFilter.endDate,
        reportType,
        includeElimination: true,
      });
      setReportRows(toReportRows(result.lines));
    } catch {
      setError("Gagal memuat laporan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [dateFilter, selectedCompanies, reportType, toReportRows]);

  return { loading, error, reportRows, fetchReport };
}
