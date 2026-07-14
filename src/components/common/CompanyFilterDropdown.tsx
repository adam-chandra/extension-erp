import { useState, useRef, useCallback } from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import type { ReportColumn } from '@/components/common/ReportTreeTable';
import { useClickOutside } from '@/hooks/useConsolidationFilters';

type CompanyFilterProps = {
  readonly companies: ReportColumn[];
  readonly selectedCompanies: string[];
  readonly onChange: (companies: string[]) => void;
};

export function CompanyFilterDropdown({
  companies,
  selectedCompanies,
  onChange,
}: CompanyFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedCount = selectedCompanies.length;
  const isAllSelected = selectedCount === companies.length;

  const closeDropdown = useCallback(() => setOpen(false), []);
  useClickOutside(ref, closeDropdown);

  const toggleCompany = (key: string) => {
    if (selectedCompanies.includes(key)) {
      onChange(selectedCompanies.filter((item) => item !== key));
      return;
    }
    onChange([...selectedCompanies, key]);
  };

  const handleSelectAll = () => {
    onChange(companies.map((company) => company.key));
  };

  const handleClear = () => {
    onChange([]);
  };

  const getCompanyLabel = () => {
    if (selectedCount === 0) {
      return 'No Company';
    }
    if (isAllSelected) {
      return 'All Company';
    }
    return `${selectedCount} Company`;
  };

  const label = getCompanyLabel();

  return (
    <div ref={ref} className="relative inline-block w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:w-auto sm:px-4 sm:py-1.5"
      >
        <Building2 className="h-4 w-4" />
        <span>{label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white p-3 shadow-lg sm:w-64">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              Select Company
            </p>

            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs font-medium text-primary hover:underline"
            >
              Select All
            </button>
          </div>

          <div className="max-h-56 space-y-2 overflow-y-auto">
            {companies.map((company) => {
              const checked = selectedCompanies.includes(company.key);
              return (
                <label
                  key={company.key}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCompany(company.key)}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span>{company.label}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
