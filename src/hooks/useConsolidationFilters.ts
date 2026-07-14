import { useEffect, type RefObject } from 'react';

/**
 * Shared hook: close dropdown/popover when user clicks outside
 * Used by DateFilterDropdown and CompanyFilterDropdown in consolidation pages
 */
export function useClickOutside(ref: RefObject<HTMLElement | null>, onOutsideClick: () => void) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutsideClick();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, onOutsideClick]);
}

/**
 * Get current year-month in YYYY-MM format
 */
export function currentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export type DateFilter = {
  startDate: string;
  endDate: string;
  label: string;
};

/**
 * Format month-year string to locale date string
 */
export function formatMonthYear(monthStr: string, locale = 'id-ID'): string {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
}
