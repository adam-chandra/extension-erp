import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Calendar, ChevronDown, X } from 'lucide-react'
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from "@/components/common/withWorkspaceLayout";
import type { ReportColumn } from "@/components/common/ReportTreeTable";
import { CompanyFilterDropdown } from "@/components/common/CompanyFilterDropdown";
import { ReportBody } from "@/components/consolidation/ReportBody";
import { useAuth } from "@/hooks/useAuth";
import { useClickOutside, currentYearMonth, type DateFilter } from "@/hooks/useConsolidationFilters";
import { useConsolidationReport } from "@/hooks/useConsolidationReport";

function thisMonthFilter(): DateFilter {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const lastDay = new Date(y, m, 0).getDate();
  const mm = String(m).padStart(2, '0');
  const endMonthLabel = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  return {
    startDate: `${y}-01-01`,
    endDate: `${y}-${mm}-${lastDay}`,
    label: `1 January ${y} - ${lastDay} ${endMonthLabel}`,
  };
}

function DateFilterDropdown({
  onApply,
  initialMonth,
}: {
  readonly onApply: (f: DateFilter | null) => void;
  readonly initialMonth?: string;
}) {
  const [open, setOpen] = useState(false)
  const [endMonth, setEndMonth] = useState(initialMonth ?? '')
  const [displayLabel, setDisplayLabel] = useState(() => {
    if (!initialMonth) return 'Select Period';
    const [year, month] = initialMonth.split('-');
    const y = Number.parseInt(year);
    const m = Number.parseInt(month);
    const lastDay = new Date(y, m, 0).getDate();
    const monthName = new Date(y, m - 1).toLocaleDateString('id-ID', { month: 'long' });
    return `1 January ${y} - ${lastDay} ${monthName}`;
  });
  const ref = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => setOpen(false), []);
  useClickOutside(ref, closeDropdown);

  const handleApply = () => {
    if (!endMonth) return
    const [year, month] = endMonth.split('-').map(Number)
    const startDate = `${year}-01-01`
    const lastDay = new Date(year, month, 0).getDate()
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`
    const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' })
    const label = `1 January ${year} - ${lastDay} ${monthName}`
    setDisplayLabel(label)
    setOpen(false)
    onApply({ startDate, endDate, label })
  }

  const handleClear = () => {
    setEndMonth('')
    setDisplayLabel('Select Period')
    setOpen(false)
    onApply(null)
  }

  const isFilterActive = displayLabel !== 'Select Period'

  return (
    <div ref={ref} className="relative inline-block w-full sm:w-auto">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-primary bg-white px-3 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/5 sm:w-auto sm:px-4 sm:py-1.5"
        >
          <Calendar className="h-4 w-4" />
          <span className="truncate">{displayLabel}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {isFilterActive && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center rounded-md border border-red-300 bg-white p-2 text-red-500 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700 sm:p-1.5"
            title="Clear filter"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 rounded-lg border border-slate-200 bg-white py-1 shadow-lg sm:left-auto sm:right-0 sm:w-64">
          <div className="flex flex-col gap-2 px-4 py-3">
            <div>
              <label
                htmlFor="bs-end-month"
                className="mb-1 block text-xs font-medium text-slate-500"
              >
                End Month
              </label>
              <input
                id="bs-end-month"
                type="month"
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleApply}
                disabled={!endMonth}
                className="flex-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BalanceSheetContent(_: WorkspaceLayoutInjectedProps) {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState<DateFilter | null>(thisMonthFilter);

  const allCompanies: ReportColumn[] = useMemo(() => {
    if (!user?.companies || user.companies.length === 0) return [];
    return user.companies.map((company) => ({
      key: company.sourceId.toString(),
      label: company.name,
    }));
  }, [user?.companies]);

  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  useEffect(() => {
    if (allCompanies.length > 0 && selectedCompanies.length === 0) {
      setSelectedCompanies(allCompanies.map((c) => c.key));
    }
  }, [allCompanies]);

  const columns = allCompanies.filter((c) => selectedCompanies.includes(c.key));

  const { loading, error, reportRows, fetchReport } = useConsolidationReport(
    dateFilter,
    selectedCompanies,
    "balance_sheet"
  );

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return (
    <section className="flex-1 p-3 sm:p-4 md:p-6 bg-slate-50 min-h-screen">
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Balance Sheet
          </h1>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <CompanyFilterDropdown
            companies={allCompanies}
            selectedCompanies={selectedCompanies}
            onChange={setSelectedCompanies}
          />
          <DateFilterDropdown onApply={setDateFilter} initialMonth={currentYearMonth()} />
        </div>
      </div>

      <ReportBody
        columns={columns}
        loading={loading}
        error={error}
        reportRows={reportRows}
        dateFilter={dateFilter}
      />
    </section>
  );
}

export default withWorkspaceLayout(BalanceSheetContent);