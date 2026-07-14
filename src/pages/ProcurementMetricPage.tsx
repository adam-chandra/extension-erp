import { useState } from "react";
import { Building, ArrowLeft } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useProcurementDocuments } from "@/hooks/useProcurementDashboard";
import { ROUTES } from "@/config/routes";
import { DataTable } from "@/components/common/DataTable";
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from "@/components/common/withWorkspaceLayout";

import {
  getCardId,
  metricPageConfig,
  cardIdToMetric,
  getColumnsForMetric,
} from "./columns/procurementColumns";

function ProcurementMetricContent({
  selectedCompany,
}: WorkspaceLayoutInjectedProps & { selectedCompany?: string }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const cardId = getCardId(searchParams.get("metric"));
  const metricType = cardIdToMetric[cardId];
  const pageConfig = metricPageConfig[cardId];
  const columns = getColumnsForMetric(cardId);

  const { data, isLoading, error } = useProcurementDocuments(
    selectedCompany ?? null,
    metricType,
    currentPage,
    itemsPerPage,
    {
      dateFilter: "all",
      companyId: selectedCompany ?? "",
      search: searchQuery,
    },
  );

  if (!selectedCompany) {
    return (
      <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Building className="mx-auto h-16 w-16 text-slate-300" />
          <h2 className="text-2xl font-semibold text-slate-700">
            Silakan pilih company
          </h2>
          <p className="text-slate-500">
            Pilih company dari sidebar untuk menampilkan detail PR dan PO
          </p>
        </div>
      </section>
    );
  }

  const totalItems = data?.total ?? 0;
  const rows = data?.items ?? [];

  return (
    <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => navigate(ROUTES.DASHBOARD_PROCUREMENT)}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors mb-3 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Kembali ke Dashboard
        </button>
        <h1 className="text-2xl font-bold text-slate-900">
          {pageConfig.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{pageConfig.description}</p>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        error={error}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        itemsPerPageOptions={[10, 20, 30, 100]}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </section>
  );
}

export const ProcurementMetricPage = withWorkspaceLayout(
  ProcurementMetricContent,
);
