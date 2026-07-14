import type { ReactNode } from "react";
import { Building, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface DataTableColumnDef<TData> {
  key: string | keyof TData | "no";
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: TData, index: number) => ReactNode;
}

export interface DataTableProps<TData> {
  columns: DataTableColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  error?: Error | null | unknown;
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  title?: string;
  emptyMessage?: string;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  onItemsPerPageChange?: (size: number) => void;
  itemsPerPageOptions?: number[];
  filterNode?: ReactNode;
  rowKey?: (row: TData) => string | number;
}

function getAlignClass(align?: "left" | "center" | "right"): string {
  switch (align) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    default:
      return "text-left";
  }
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  error = null,
  totalItems = 0,
  currentPage = 1,
  itemsPerPage = 10,
  onPageChange,
  title,
  emptyMessage = "Tidak ada data untuk ditampilkan",
  onSearchChange,
  searchValue,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
  filterNode,
  rowKey,
}: Readonly<DataTableProps<TData>>) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  function renderCell(
    col: DataTableColumnDef<TData>,
    row: TData,
    rowIndex: number,
  ): ReactNode {
    if (col.key === "no") return startIndex + rowIndex + 1;
    const value = row[col.key as keyof TData];
    if (col.render) return col.render(value, row, rowIndex);
    if (value === null || value === undefined)
      return <span className="text-gray-400">-</span>;
    return String(value);
  }

  function getPageNumbers(): (number | "ellipsis")[] {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200/60 w-full transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 pt-4 pb-3">
        {(title || totalItems > 0) && (
          <div className="flex items-center gap-3">
            {title && (
              <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            )}
            {totalItems > 0 && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {totalItems} item
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 ml-auto w-full sm:w-auto">
          {onItemsPerPageChange && itemsPerPageOptions && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 whitespace-nowrap">
                Tampilkan
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="h-9 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filterNode && <div className="flex items-center">{filterNode}</div>}

          {onSearchChange && (
            <div className="relative w-full sm:w-auto">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Cari..."
                value={searchValue ?? ""}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block h-9 w-full sm:w-64 rounded-md border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-4">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-3">
              <div className="animate-spin inline-flex h-8 w-8 rounded-full border-4 border-slate-300 border-t-primary" />
              <p className="text-sm text-slate-500">Memuat data...</p>
            </div>
          </div>
        )}

        {!isLoading && !!error && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-3">
              <Building className="mx-auto h-10 w-10 text-red-300" />
              <p className="text-sm text-red-500">
                {error instanceof Error ? error.message : "Gagal memuat data."}
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="rounded-xl border border-slate-200/60 overflow-hidden relative">
              <div className="overflow-auto max-h-[500px] custom-scrollbar">
                <Table>
                  <TableHeader className="bg-slate-50/90 backdrop-blur-md sticky top-0 z-10 shadow-sm">
                    <TableRow className="border-b-slate-200/60">
                      
                      {columns.map((col) => (
                        <TableHead
                          key={String(col.key)}
                          className={`h-11 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider ${getAlignClass(col.align)}`}
                          style={{ width: col.width }}
                        >
                          {col.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center text-sm text-gray-500"
                        >
                          {emptyMessage}
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.map((row, rowIndex) => (
                        
                        <TableRow
                          key={rowKey ? rowKey(row) : JSON.stringify(row)}
                          className={`group border-b-slate-100 last:border-0 transition-colors duration-200 ${
                            rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                          } hover:bg-primary/5`}
                        >
                          
                          {columns.map((col) => (
                            <TableCell
                              key={String(col.key)}
                              className={`py-3 px-4 text-sm text-slate-700 group-hover:text-slate-900 transition-colors ${getAlignClass(col.align)}`}
                            >
                              {renderCell(col, row, rowIndex)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {totalItems > 0 && onPageChange && (
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="text-xs font-medium text-slate-500">
                  Menampilkan{" "}
                  <span className="font-semibold text-slate-700">
                    {startIndex + 1}
                  </span>{" "}
                  –{" "}
                  <span className="font-semibold text-slate-700">
                    {endIndex}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold text-slate-700">
                    {totalItems}
                  </span>{" "}
                  item
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                      currentPage === 1
                        ? "bg-slate-50 text-slate-400 cursor-not-allowed border border-transparent"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary hover:border-primary/30 active:scale-95 shadow-sm"
                    }`}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Prev
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {(() => {
                      const pageNumbers = getPageNumbers()
                      return pageNumbers.map((p, i) =>
                        p === "ellipsis" ? (
                          <span
                            key={`ellipsis-before-${pageNumbers[i + 1] ?? "end"}`}
                            className="px-1 text-slate-400 text-xs"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`min-w-[28px] h-7 px-2 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center ${
                              currentPage === p
                                ? "bg-primary text-white shadow-sm shadow-primary/30 ring-1 ring-primary/50"
                                : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
                            }`}
                          >
                            {p}
                          </button>
                        ),
                      )
                    })()}
                  </div>

                  <button
                    onClick={() =>
                      onPageChange(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                      currentPage === totalPages
                        ? "bg-slate-50 text-slate-400 cursor-not-allowed border border-transparent"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary hover:border-primary/30 active:scale-95 shadow-sm"
                    }`}
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}