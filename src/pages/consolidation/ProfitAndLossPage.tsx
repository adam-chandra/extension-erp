import { useState, useRef, useMemo, useEffect} from "react";
import { Calendar, ChevronDown, X } from "lucide-react";
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from "@/components/common/withWorkspaceLayout";
import type { ReportColumn } from "@/components/common/ReportTreeTable";
import { CompanyFilterDropdown } from "@/components/common/CompanyFilterDropdown";
import { ReportBody } from "@/components/consolidation/ReportBody";
import { useAuth } from "@/hooks/useAuth";
import { useClickOutside, currentYearMonth, formatMonthYear, type DateFilter } from "@/hooks/useConsolidationFilters";
import { useConsolidationReport } from "@/hooks/useConsolidationReport";

function thisMonthFilter(): DateFilter {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const lastDay = new Date(y, m, 0).getDate();
  const mm = String(m).padStart(2, "0");
  return {
    startDate: `${y}-${mm}-01`,
    endDate: `${y}-${mm}-${lastDay}`,
    label: now.toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
  };
}

function DateFilterDropdown({
  onApply,
  initialMonth,
}: {
  readonly onApply: (filter: DateFilter | null) => void;
  readonly initialMonth: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [displayLabel, setDisplayLabel] = useState("Select Period");

  useClickOutside(ref, () => setOpen(false));

  useEffect(() => {
    if (initialMonth) {
      setStartMonth(initialMonth);
      setEndMonth(initialMonth);
    }
  }, [initialMonth]);

  const handleApply = () => {
    if (!startMonth || !endMonth) return;
    const [sy, sm] = startMonth.split("-").map(Number);
    const [ey, em] = endMonth.split("-").map(Number);
    const startDate = `${sy}-${String(sm).padStart(2, "0")}-01`;
    const lastDay = new Date(ey, em, 0).getDate();
    const endDate = `${ey}-${String(em).padStart(2, "0")}-${lastDay}`;
    const label = `${formatMonthYear(startMonth)} - ${formatMonthYear(endMonth)}`;
    setDisplayLabel(label);
    setOpen(false);
    onApply({ startDate, endDate, label });
  };

  const handleClear = () => {
    setStartMonth("");
    setEndMonth("");
    setDisplayLabel("Select Period");
    setOpen(false);
    onApply(null);
  };

  const isFilterActive = displayLabel !== "Select Period";

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
                htmlFor="pl-start-month"
                className="mb-1 block text-xs font-medium text-slate-500"
              >
                Start Month
              </label>
              <input
                id="pl-start-month"
                type="month"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="pl-end-month"
                className="mb-1 block text-xs font-medium text-slate-500"
              >
                End Month
              </label>
              <input
                id="pl-end-month"
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
                disabled={!startMonth || !endMonth}
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

function ProfitAndLossContent(_: WorkspaceLayoutInjectedProps) {
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
    "profit_loss"
  );

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return (
    <section className="min-h-screen flex-1 bg-slate-50 p-3 sm:p-4 md:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            Profit & Loss Statement
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

export default withWorkspaceLayout(ProfitAndLossContent);