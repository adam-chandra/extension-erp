import { useState, useRef, useEffect } from 'react'
import { Building, Calendar, ChevronDown } from 'lucide-react'
import { ListViewCard } from '@/components/common/ListViewCard'
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from '@/components/common/withWorkspaceLayout'
import { useFinanceReturnsByAccount } from '@/hooks/useFinanceDashboard'
import type { DashboardPeriod, DashboardDateRange } from '@/services/finance.service'

type DateFilterOption = DashboardPeriod

const DATE_FILTER_LABELS: Record<DateFilterOption, string> = {
  all: 'All Time',
  month: 'This Month',
  year: 'This Year',
  custom: 'Custom Range',
}

function DateFilterDropdown({
  value,
  range,
  onChange,
}: {
  value: DateFilterOption
  range: DashboardDateRange
  onChange: (v: DateFilterOption, r: DashboardDateRange) => void
}) {
  const [open, setOpen] = useState(false)
  const [draftStart, setDraftStart] = useState(range.start ?? '')
  const [draftEnd, setDraftEnd] = useState(range.end ?? '')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const options: DateFilterOption[] = ['all', 'year', 'month', 'custom']

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-md border border-primary bg-white px-3 py-1.5 text-sm font-medium text-primary shadow-sm hover:bg-primary/5 transition-colors"
      >
        <Calendar className="h-4 w-4" />
        <span>{DATE_FILTER_LABELS[value]}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                if (opt !== 'custom') {
                  onChange(opt, {})
                  setOpen(false)
                } else {
                  onChange(opt, { start: draftStart, end: draftEnd })
                }
              }}
              className={`flex w-full items-center px-4 py-2 text-sm transition-colors hover:bg-primary/5 ${
                value === opt ? 'font-semibold text-primary' : 'text-slate-700'
              }`}
            >
              {DATE_FILTER_LABELS[opt]}
            </button>
          ))}

          {value === 'custom' && (
            <div className="border-t border-slate-100 px-4 py-3 flex flex-col gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={draftStart}
                  onChange={(e) => setDraftStart(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={draftEnd}
                  onChange={(e) => setDraftEnd(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                disabled={!draftStart || !draftEnd}
                onClick={() => {
                  onChange('custom', { start: draftStart, end: draftEnd })
                  setOpen(false)
                }}
                className="mt-1 w-full rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatIDR(value: number): string {
  if (!Number.isFinite(value)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

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
          range={customRange}
          onChange={(v, r) => {
            setDateFilter(v)
            setCustomRange(r)
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
          columns={[
            { key: 'no', label: 'No', width: '80px', align: 'center' },
            { key: 'code', label: 'COA', width: '110px', align: 'left' },
            { key: 'deskripsi', label: 'Deskripsi', align: 'left' },
            {
              key: 'nilaiRetur',
              label: 'Nilai Retur',
              width: '200px',
              align: 'right',
              render: (value) => formatIDR(value as number),
            },
            { key: 'persentaseRetur', label: '% Retur', width: '100px', align: 'center' },
          ]}
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
