import { useEffect, useRef } from "react";
import type { ReportRow } from "./ReportTreeTable";

export type GLEntry = Record<string, string | number | null | undefined>;

// Replace union type with a type alias
type GLCellValue = string | number | null | undefined;

export type GLColumnConfig = {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  format?: (value: GLCellValue, row: GLEntry) => string;
  className?: string | ((value: GLCellValue, row: GLEntry) => string);
};

export type AccountSummary = {
  accountCode?: string;
  accountName?: string;
  debit: number;
  credit: number;
  balance: number;
};

type Props = {
  readonly open: boolean;
  readonly account: ReportRow | null;
  readonly onClose: () => void;
  readonly title?: string;
  readonly columns?: GLColumnConfig[];
  readonly data?: GLEntry[];
  readonly summary?: AccountSummary;
  readonly emptyMessage?: string;
  readonly emptySubMessage?: string;
  readonly showFooter?: boolean;
  readonly footerContent?: (data: GLEntry[]) => React.ReactNode;
};

const formatRupiah = (value: GLCellValue) => {
  if (value === null || value === undefined) return "-";

  const numValue = typeof value === "string" ? Number.parseFloat(value) : value;

  if (Number.isNaN(numValue)) return "-";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(numValue);
};

const formatDate = (value: GLCellValue) => {
  if (!value) return "-";

  try {
    return new Date(String(value)).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
};

const defaultColumns: GLColumnConfig[] = [
  {
    key: "date",
    label: "Date",
    width: "w-32",
    align: "left",
    format: formatDate,
  },
  {
    key: "journal",
    label: "JRNL",
    width: "w-24",
    align: "left",
  },
  {
    key: "partner",
    label: "Partner",
    width: "w-36",
    align: "left",
  },
  {
    key: "move",
    label: "Move",
    width: "w-44",
    align: "left",
  },
  {
    key: "entryLabel",
    label: "Entry Label",
    align: "left",
  },
  {
    key: "amountCurrency",
    label: "Amount Currency",
    width: "w-44",
    align: "right",
    format: formatRupiah,
    className: (value) => {
      const num = Number(value);
      return num < 0 ? "text-red-600" : "text-gray-500";
    },
  },
  {
    key: "debit",
    label: "Debit",
    width: "w-36",
    align: "right",
    format: formatRupiah,
  },
  {
    key: "credit",
    label: "Credit",
    width: "w-36",
    align: "right",
    format: formatRupiah,
  },
  {
    key: "balance",
    label: "Balance",
    width: "w-36",
    align: "right",
    format: formatRupiah,
    className: (value) => {
      const num = Number(value);
      return num < 0 ? "text-red-600" : "text-gray-500";
    },
  },
];

export default function AccountDetailModal({
  open,
  account,
  onClose,
  title = "GL View",
  columns = defaultColumns,
  data = [],
  summary,
  emptyMessage = "No transactions found",
  emptySubMessage = "This account has no GL entries yet",
  showFooter = true,
  footerContent,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && account) {
      if (!dialog.open) dialog.showModal();
      return;
    }
    
    if (dialog.open) dialog.close();
  }, [open, account]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener("cancel", handleCancel);
    
    // Handle backdrop click using native dialog events
    const handleClick = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = 
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      
      if (!isInDialog) {
        onClose();
      }
    };
    
    dialog.addEventListener("click", handleClick);
    
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleClick);
    };
  }, [onClose]);

  if (!open || !account) return null;

  const glEntries = data;

  const totalDebit = glEntries.reduce(
    (sum, row) => sum + Number(row.debit ?? 0),
    0,
  );

  const totalCredit = glEntries.reduce(
    (sum, row) => sum + Number(row.credit ?? 0),
    0,
  );

  const lastBalance = Number(glEntries.at(-1)?.balance ?? 0);

  const accountSummary: AccountSummary = summary ?? {
    accountCode: account.coa,
    accountName: account.description,
    debit: totalDebit,
    credit: totalCredit,
    balance: lastBalance,
  };

  const getAlignClass = (align?: "left" | "center" | "right") => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  const getCellClassName = (
    column: GLColumnConfig,
    value: GLCellValue,
    row: GLEntry,
  ) => {
    const baseClass = getAlignClass(column.align);
    let customClass = "";

    if (typeof column.className === "function") {
      customClass = column.className(value, row);
    } else if (column.className) {
      customClass = column.className;
    }

    return `px-2 py-2 ${baseClass} ${customClass}`.trim();
  };

  const renderCellValue = (column: GLColumnConfig, row: GLEntry) => {
    const value = row[column.key];

    if (column.format) {
      return column.format(value, row);
    }

    return value ?? "-";
  };

  const generateRowKey = (row: GLEntry, index: number) => {
    return `${row.date ?? index}-${row.move ?? ""}-${row.entryLabel ?? ""}`;
  };

  const defaultFooterContent = (entries: GLEntry[]) => {
    return (
      <div className="flex items-center justify-between text-sm">
        <p className="text-gray-600">
          Total Entries:{" "}
          <span className="font-semibold text-gray-900">{entries.length}</span>
        </p>

        <p className="text-gray-600">
          Current Balance:{" "}
          <span
            className={`ml-2 font-semibold ${
              accountSummary.balance < 0 ? "text-red-600" : "text-gray-900"
            }`}
          >
            {formatRupiah(accountSummary.balance)}
          </span>
        </p>
      </div>
    );
  };

  return (
    <dialog
      ref={dialogRef}
      className="m-auto max-h-none w-full max-w-[1500px] overflow-hidden rounded bg-transparent p-0 backdrop:bg-black/50"
      aria-labelledby="modal-title"
    >
      <div className="h-[92vh] overflow-hidden rounded bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2
            id="modal-title"
            className="text-sm font-semibold text-gray-700"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-500 hover:text-black"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <div className="h-[calc(92vh-105px)] overflow-auto p-7">
          <table className="mb-4 w-full border-collapse text-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr className="border-b-2 border-gray-500">
                <th className="px-2 py-3 text-left">Account</th>
                <th className="px-2 py-3 text-right">Debit(Rp)</th>
                <th className="px-2 py-3 text-right">Credit(Rp)</th>
                <th className="px-2 py-3 text-right">Balance(Rp)</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="px-2 py-1.5 text-gray-700">
                  {accountSummary.accountCode
                    ? `${accountSummary.accountCode} - `
                    : ""}
                  {accountSummary.accountName}
                </td>

                <td className="px-2 py-1.5 text-right text-gray-700">
                  {formatRupiah(accountSummary.debit)}
                </td>

                <td className="px-2 py-1.5 text-right text-gray-700">
                  {formatRupiah(accountSummary.credit)}
                </td>

                <td
                  className={`px-2 py-1.5 text-right ${
                    accountSummary.balance < 0
                      ? "text-red-600"
                      : "text-gray-700"
                  }`}
                >
                  {formatRupiah(accountSummary.balance)}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-gray-200 text-gray-900">
              <tr className="border-b-2 border-gray-500">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-2 py-4 font-semibold ${getAlignClass(
                      column.align,
                    )} ${column.width ?? ""}`.trim()}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {glEntries.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <p className="font-medium">{emptyMessage}</p>
                    <p className="mt-1 text-xs">{emptySubMessage}</p>
                  </td>
                </tr>
              ) : (
                glEntries.map((entry, index) => (
                  <tr
                    key={generateRowKey(entry, index)}
                    className="border-b hover:bg-gray-50"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={getCellClassName(
                          column,
                          entry[column.key],
                          entry,
                        )}
                      >
                        {renderCellValue(column, entry)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showFooter && (
          <div className="border-t bg-gray-50 px-6 py-4">
            {footerContent
              ? footerContent(glEntries)
              : defaultFooterContent(glEntries)}
          </div>
        )}
      </div>
    </dialog>
  );
}

export { formatRupiah, formatDate };