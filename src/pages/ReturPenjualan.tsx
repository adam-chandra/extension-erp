import { useState } from 'react'
import { Building } from 'lucide-react'
import { ListViewCard } from '@/components/common/ListViewCard'
import { DateFilterDropdown } from '@/components/common/DateFilterDropdown'
import { RETUR_PENJUALAN_COLUMNS } from '@/utils/finance'
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from '@/components/common/withWorkspaceLayout'
import { useFinanceReturnsByAccount } from '@/hooks/useFinanceDashboard'
import type { DashboardDateRange } from '@/services/finance.service'
import type { DateFilterOption } from '@/types/procurement'

function ReturPenjualanContent({ selectedCompany }: WorkspaceLayoutInjectedProps & { selectedCompany?: string }) {
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all')
  const [customRange, setCustomRange] = useState<DashboardDateRange>({})

  const companyId = selectedCompany ? Number(selectedCompany) : null
  const validCompanyId = companyId && Number.isFinite(companyId) && companyId > 0 ? companyId : null

  const returQuery = useFinanceReturnsByAccount(validCompanyId, dateFilter, customRange, 100)
  const rows = returQuery.data ?? []

  if (!validCompanyId) {
    return (
      <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Building className="mx-auto h-16 w-16 text-slate-300" />
          <h2 className="text-2xl font-semibold text-slate-700">Silakan pilih company</h2>
          <p className="text-slate-500">Pilih company dari sidebar untuk menampilkan data retur penjualan</p>
        </div>
      </section>
    )
  }

  return (
    <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">RETUR PENJUALAN GENERAL LEDGER</h1>
        <DateFilterDropdown
          value={dateFilter}
          onChange={(v, start, end) => {
            setDateFilter(v)
            setCustomRange(v === 'custom' ? { start: start ?? '', end: end ?? '' } : {})
          }}
        />
      </div>

      {returQuery.isError ? (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Gagal memuat data retur penjualan.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6">
        <ListViewCard
          title="Daftar Retur Penjualan"
          data={rows.map((r) => ({
            no: r.no,
            code: r.code,
            deskripsi: r.name,
            nilaiRetur: r.balance,
            persentaseRetur: `${r.percentage.toFixed(1)}%`,
          }))}
          columns={RETUR_PENJUALAN_COLUMNS('80px', '200px')}
          pagination={true}
          itemsPerPage={10}
          cardId="retur-list"
          module="accounting"
        />
      </div>
    </section>
  )
}

export const ReturPenjualan = withWorkspaceLayout(ReturPenjualanContent)
