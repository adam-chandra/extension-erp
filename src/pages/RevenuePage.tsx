import { useState } from 'react'
import { Building } from 'lucide-react'
import { ListViewCard } from '@/components/common/ListViewCard'
import { DateFilterDropdown } from '@/components/common/DateFilterDropdown'
import { type DateFilterOption } from '@/types/procurement'
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from '@/components/common/withWorkspaceLayout'


function RevenuePageContent({ selectedCompany }: WorkspaceLayoutInjectedProps & { selectedCompany?: string }) {
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all')
  const handleDateFilterChange = (value: DateFilterOption) => {
    setDateFilter(value)
  }

  if (!selectedCompany) {
    return (
      <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Building className="mx-auto h-16 w-16 text-slate-300" />
          <h2 className="text-2xl font-semibold text-slate-700">Silakan pilih company</h2>
          <p className="text-slate-500">Pilih company dari sidebar untuk menampilkan data revenue</p>
        </div>
      </section>
    )
  }

  return (
    <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">REVENUE GENERAL LEDGER</h1>
        <DateFilterDropdown value={dateFilter} onChange={handleDateFilterChange} />
      </div>

      {/* Revenue ListView */}
      <div className="grid grid-cols-1 gap-6">
        <ListViewCard
          title="Daftar Revenue"
          data={[
            { no: 1, tanggal: '2026-01-15', noTransaksi: 'REV-2026-001', customer: 'PT Maju Jaya', kategori: 'Penjualan Produk', keterangan: 'Laptop ASUS ROG Strix', nilaiRevenue: 45000000 },
            { no: 2, tanggal: '2026-01-18', noTransaksi: 'REV-2026-002', customer: 'CV Berkah Selalu', kategori: 'Penjualan Produk', keterangan: 'Monitor LG UltraWide 34"', nilaiRevenue: 12500000 },
            { no: 3, tanggal: '2026-01-22', noTransaksi: 'REV-2026-003', customer: 'PT Digital Teknologi', kategori: 'Jasa Instalasi', keterangan: 'Instalasi Network Infrastructure', nilaiRevenue: 25000000 },
            { no: 4, tanggal: '2026-02-05', noTransaksi: 'REV-2026-004', customer: 'Toko Elektronik Jaya', kategori: 'Penjualan Produk', keterangan: 'Keyboard Mechanical RGB', nilaiRevenue: 3500000 },
            { no: 5, tanggal: '2026-02-10', noTransaksi: 'REV-2026-005', customer: 'PT Solusi Informatika', kategori: 'Penjualan Produk', keterangan: 'Server Dell PowerEdge', nilaiRevenue: 85000000 },
            { no: 6, tanggal: '2026-02-15', noTransaksi: 'REV-2026-006', customer: 'CV Mandiri Sejahtera', kategori: 'Jasa Konsultasi', keterangan: 'IT Consulting Services', nilaiRevenue: 18000000 },
            { no: 7, tanggal: '2026-02-28', noTransaksi: 'REV-2026-007', customer: 'PT Inovasi Digital', kategori: 'Penjualan Produk', keterangan: 'Workstation HP Z4 G4', nilaiRevenue: 32000000 },
            { no: 8, tanggal: '2026-03-05', noTransaksi: 'REV-2026-008', customer: 'Universitas Teknologi', kategori: 'Penjualan Produk', keterangan: 'Proyektor Epson EB-X49', nilaiRevenue: 8500000 },
            { no: 9, tanggal: '2026-03-12', noTransaksi: 'REV-2026-009', customer: 'PT Media Kreatif', kategori: 'Penjualan Produk', keterangan: 'MacBook Pro M3 16"', nilaiRevenue: 52000000 },
            { no: 10, tanggal: '2026-03-20', noTransaksi: 'REV-2026-010', customer: 'CV Sukses Bersama', kategori: 'Jasa Maintenance', keterangan: 'Annual Maintenance Contract', nilaiRevenue: 15000000 },
            { no: 11, tanggal: '2026-04-02', noTransaksi: 'REV-2026-011', customer: 'PT Cahaya Digital', kategori: 'Penjualan Produk', keterangan: 'Printer Canon imagePRESS', nilaiRevenue: 28000000 },
            { no: 12, tanggal: '2026-04-15', noTransaksi: 'REV-2026-012', customer: 'Koperasi Sejahtera', kategori: 'Penjualan Produk', keterangan: 'Software License Microsoft 365', nilaiRevenue: 12000000 },
            { no: 13, tanggal: '2026-04-28', noTransaksi: 'REV-2026-013', customer: 'PT Nusantara Tech', kategori: 'Penjualan Produk', keterangan: 'Storage NAS Synology', nilaiRevenue: 22000000 },
            { no: 14, tanggal: '2026-05-10', noTransaksi: 'REV-2026-014', customer: 'Hotel Grand Permata', kategori: 'Jasa Instalasi', keterangan: 'Hotel Management System', nilaiRevenue: 45000000 },
            { no: 15, tanggal: '2026-05-25', noTransaksi: 'REV-2026-015', customer: 'PT Retail Modern', kategori: 'Penjualan Produk', keterangan: 'POS System Complete', nilaiRevenue: 35000000 },
          ]}
          columns={[
            { key: 'no', label: 'No', width: '80px', align: 'center' },
            { key: 'tanggal', label: 'Tanggal', width: '120px', align: 'center' },
            { key: 'noTransaksi', label: 'No Transaksi', width: '140px', align: 'left' },
            { key: 'customer', label: 'Customer', align: 'left' },
            { key: 'kategori', label: 'Kategori', width: '150px', align: 'left' },
            { key: 'keterangan', label: 'Keterangan', align: 'left' },
            { 
              key: 'nilaiRevenue', 
              label: 'Nilai Revenue', 
              width: '160px',
              align: 'right',
              render: (value) => `Rp ${value.toLocaleString('id-ID')}`
            },
          ]}
          pagination={true}
          itemsPerPage={10}
          cardId="revenue-list"
          module="accounting"
        />
      </div>
    </section>
  )
}

export const RevenuePage = withWorkspaceLayout(RevenuePageContent)
