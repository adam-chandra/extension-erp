import { useState, type KeyboardEvent } from "react";

export type ReportColumn = {
  key: string;
  label: string;
};

export type ReportRow = {
  id: string;
  coa: string;
  description: string;
  isSubtotal?: boolean;
  isFooter?: boolean;
  values: Record<string, number>;
  eliminationDebit?: number;
  eliminationCredit?: number;
  children?: ReportRow[];
};

type Props = {
  readonly columns: ReportColumn[];
  readonly data: ReportRow[];
  readonly onRowClick?: (row: ReportRow) => void;
};

const COA_WIDTH = 160;
const DESCRIPTION_WIDTH = 340;
const VALUE_WIDTH = 220;

const TABLE_COLUMNS = (length: number) =>
  `${COA_WIDTH}px ${DESCRIPTION_WIDTH}px repeat(${length}, ${VALUE_WIDTH}px) ${VALUE_WIDTH}px ${VALUE_WIDTH}px ${VALUE_WIDTH}px 220px`;

const formatNumber = (value: number) => {
  if (!value) return "";

  return (
    "Rp\u00A0" +
    new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  );
};

const ExpandIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <svg
    className={`mr-2 h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
      isExpanded ? "rotate-90" : ""
    }`}
    fill="none"
    strokeWidth="2"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// Extracted helper to resolve row class names — avoids nested ternary
const getDataRowClassName = (
  hasChildren: boolean,
  hasRowClickHandler: boolean,
): string => {
  const base =
    "grid min-h-11 border-b border-slate-100 text-sm transition-colors";

  if (hasChildren) {
    return `${base} cursor-pointer bg-white font-semibold hover:bg-slate-50`;
  }

  if (hasRowClickHandler) {
    return `${base} cursor-pointer bg-white hover:bg-blue-50/60`;
  }

  return `${base} bg-white hover:bg-slate-50/70`;
};

export default function ReportTreeTable({ columns, data, onRowClick }: Props) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const gridTemplateColumns = TABLE_COLUMNS(columns.length);

  const stickyCoaStyle = {
    left: 0,
    zIndex: 20,
  };

  const stickyDescriptionStyle = {
    left: COA_WIDTH,
    zIndex: 20,
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const nonSubtotalChildren = (row: ReportRow): ReportRow[] =>
    (row.children ?? []).filter((child) => !child.isSubtotal);

  const getColumnValue = (row: ReportRow, columnKey: string): number => {
    if (row.children?.length) {
      return nonSubtotalChildren(row).reduce(
        (sum, child) => sum + getColumnValue(child, columnKey),
        0,
      );
    }

    return row.values[columnKey] ?? 0;
  };

  const getEliminationDebit = (row: ReportRow): number => {
    if (row.children?.length) {
      return nonSubtotalChildren(row).reduce(
        (sum, child) => sum + getEliminationDebit(child),
        0,
      );
    }

    return row.eliminationDebit ?? 0;
  };

  const getEliminationCredit = (row: ReportRow): number => {
    if (row.children?.length) {
      return nonSubtotalChildren(row).reduce(
        (sum, child) => sum + getEliminationCredit(child),
        0,
      );
    }

    return row.eliminationCredit ?? 0;
  };

  const getRowTotal = (row: ReportRow) => {
    return columns.reduce((sum, col) => sum + getColumnValue(row, col.key), 0);
  };

  const getAfterEliminationTotal = (row: ReportRow) => {
    return (
      getRowTotal(row) +
      getEliminationDebit(row) -
      getEliminationCredit(row)
    );
  };

  const renderDataRow = (row: ReportRow, level = 0) => {
    const hasChildren = !!row.children?.length;
    const isExpanded = !!expandedRows[row.id];

    if (row.isSubtotal) {
      return (
        <div
          key={row.id}
          className="grid min-h-11 border-b border-t border-indigo-300 bg-indigo-50 text-sm font-bold uppercase text-indigo-900"
          style={{ gridTemplateColumns }}
        >
          <div
            className="sticky border-r border-indigo-200 bg-indigo-50 px-3 py-2"
            style={stickyCoaStyle}
          />

          <div
            className="sticky flex items-center border-r border-indigo-200 bg-indigo-50 px-3 py-2"
            style={stickyDescriptionStyle}
          >
            {row.description}
          </div>

          {columns.map((col) => (
            <div
              key={col.key}
              className="flex items-center justify-end border-r border-indigo-200 px-3 py-2 font-mono tabular-nums"
            >
              {formatNumber(row.values[col.key] ?? 0)}
            </div>
          ))}

          <div className="flex items-center justify-end border-r border-indigo-200 px-3 py-2 font-mono tabular-nums">
            {formatNumber(getRowTotal(row))}
          </div>

          <div className="flex items-center justify-end border-r border-indigo-200 px-3 py-2 font-mono tabular-nums">
            {formatNumber(row.eliminationDebit ?? 0)}
          </div>

          <div className="flex items-center justify-end border-r border-indigo-200 px-3 py-2 font-mono tabular-nums">
            {formatNumber(row.eliminationCredit ?? 0)}
          </div>

          <div className="flex items-center justify-end px-3 py-2 font-mono tabular-nums">
            {formatNumber(getAfterEliminationTotal(row))}
          </div>
        </div>
      );
    }

    const handleRowAction = () => {
      if (hasChildren) {
        toggleRow(row.id);
      } else {
        onRowClick?.(row);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleRowAction();
      }
    };

    const rowClassName = getDataRowClassName(hasChildren, !!onRowClick);

    return (
      <div key={row.id}>
        {/*
          Use a <button> as the interactive row wrapper so it is
          natively focusable, keyboard-operable, and has an implicit
          role="button" — satisfying SonarQube's a11y rules without
          any extra role/tabIndex/keyboard-listener boilerplate.
        */}
        <button
          type="button"
          onClick={handleRowAction}
          onKeyDown={handleKeyDown}
          className={`w-full text-left ${rowClassName}`}
          style={{ gridTemplateColumns }}
          aria-expanded={hasChildren ? isExpanded : undefined}
        >
          <div
            className="sticky flex items-center border-r border-slate-100 bg-white px-3 py-2 text-slate-700"
            style={{
              ...stickyCoaStyle,
              paddingLeft: `${12 + level * 24}px`,
            }}
          >
            {hasChildren && <ExpandIcon isExpanded={isExpanded} />}
            <span className="font-mono text-xs tabular-nums">{row.coa}</span>
          </div>

          <div
            className="sticky flex items-center border-r border-slate-100 bg-white px-3 py-2 text-slate-700"
            style={stickyDescriptionStyle}
          >
            <span className="line-clamp-2">{row.description}</span>
          </div>

          {columns.map((col) => (
            <div
              key={col.key}
              className="flex items-center justify-end whitespace-nowrap border-r border-slate-100 px-3 py-2 font-mono tabular-nums text-slate-700"
            >
              {!hasChildren && formatNumber(row.values[col.key] ?? 0)}
            </div>
          ))}

          <div className="flex items-center justify-end border-r border-slate-100 px-3 py-2 font-mono font-semibold tabular-nums text-slate-800">
            {!hasChildren && formatNumber(getRowTotal(row))}
          </div>

          <div className="flex items-center justify-end whitespace-nowrap border-r border-slate-100 px-3 py-2 font-mono tabular-nums text-slate-700">
            {!hasChildren && formatNumber(row.eliminationDebit ?? 0)}
          </div>

          <div className="flex items-center justify-end whitespace-nowrap border-r border-slate-100 px-3 py-2 font-mono tabular-nums text-slate-700">
            {!hasChildren && formatNumber(row.eliminationCredit ?? 0)}
          </div>

          <div className="flex items-center justify-end px-3 py-2 font-mono font-semibold tabular-nums text-slate-900">
            {!hasChildren && formatNumber(getAfterEliminationTotal(row))}
          </div>
        </button>

        {hasChildren && isExpanded && (
          <>
            {row.children?.map((child) => renderDataRow(child, level + 1))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="max-h-[70vh] overflow-auto rounded-xl">
        <div className="min-w-max">
          <div
            className="sticky top-0 z-40 grid border-b border-slate-300 bg-slate-50 text-sm font-semibold text-slate-800 shadow-sm"
            style={{
              gridTemplateColumns,
              gridTemplateRows: "44px 44px",
            }}
          >
            <div
              className="sticky row-span-2 flex items-center justify-center border-b border-r border-slate-200 bg-slate-50 px-3"
              style={{
                ...stickyCoaStyle,
                zIndex: 60,
              }}
            >
              COA
            </div>

            <div
              className="sticky row-span-2 flex items-center justify-center border-b border-r border-slate-200 bg-slate-50 px-3"
              style={{
                ...stickyDescriptionStyle,
                zIndex: 60,
              }}
            >
              Deskripsi
            </div>

            {columns.map((col) => (
              <div
                key={col.key}
                className="row-span-2 flex items-center justify-center border-b border-r border-slate-200 px-3 text-center"
              >
                {col.label}
              </div>
            ))}

            <div className="row-span-2 flex items-center justify-center border-b border-r border-slate-200 px-3 text-center">
              Total
            </div>

            <div className="col-span-2 flex items-center justify-center border-b border-r border-slate-200 px-3 text-center">
              Eliminasi
            </div>

            <div className="row-span-2 flex items-center justify-center border-b border-slate-200 px-3 text-center">
              Total After Eliminasi
            </div>

            <div className="flex items-center justify-center border-r border-slate-200 px-3 text-xs font-medium text-slate-600">
              Debit
            </div>

            <div className="flex items-center justify-center border-r border-slate-200 px-3 text-xs font-medium text-slate-600">
              Kredit
            </div>
          </div>

          <div>{data.map((row) => renderDataRow(row))}</div>
        </div>
      </div>
    </div>
  );
}