import { useState } from 'react'
import { Building } from 'lucide-react'
import { ListViewCard } from '@/components/common/ListViewCard'
import { DateFilterDropdown } from '@/components/common/DateFilterDropdown'
import { type DateFilterOption } from '@/types/procurement'
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from '@/components/common/withWorkspaceLayout'

function BiayaPenjualanContent({ selectedCompany }: WorkspaceLayoutInjectedProps & { selectedCompany?: string }) {
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
          <p className="text-slate-500">Pilih company dari sidebar untuk menampilkan data biaya penjualan</p>
        </div>
      </section>
    )
  }

  return (
    <section className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">BIAYA PENJUALAN GENERAL LEDGER</h1>
        <DateFilterDropdown value={dateFilter} onChange={handleDateFilterChange} />
      </div>

      {/* Biaya Penjualan ListView */}
      <div className="grid grid-cols-1 gap-6">
        <ListViewCard
          title="Daftar Biaya Penjualan"
          data={[
            { no: 1, tanggal: '2026-01-15', noBukti: 'BP-2026-001', kategori: 'Biaya Pengiriman', keterangan: 'Ongkir Jakarta - Surabaya', vendor: 'PT JNE Express', nilaiBiaya: 2500000 },
            { no: 2, tanggal: '2026-01-18', noBukti: 'BP-2026-002', kategori: 'Biaya Marketing', keterangan: 'Iklan Facebook Ads', vendor: 'Meta Platforms', nilaiBiaya: 5000000 },
            { no: 3, tanggal: '2026-01-22', noBukti: 'BP-2026-003', kategori: 'Komisi Sales', keterangan: 'Komisi Penjualan Q1', vendor: 'Sales Team', nilaiBiaya: 12000000 },
            { no: 4, tanggal: '2026-02-05', noBukti: 'BP-2026-004', kategori: 'Biaya Pengiriman', keterangan: 'Ongkir Bandung - Medan', vendor: 'PT Tiki Jalur Nugraha', nilaiBiaya: 3200000 },
            { no: 5, tanggal: '2026-02-10', noBukti: 'BP-2026-005', kategori: 'Biaya Packaging', keterangan: 'Karton dan Bubble Wrap', vendor: 'CV Maju Packaging', nilaiBiaya: 1500000 },
            { no: 6, tanggal: '2026-02-15', noBukti: 'BP-2026-006', kategori: 'Biaya Marketing', keterangan: 'Google Ads Campaign', vendor: 'Google Indonesia', nilaiBiaya: 8000000 },
            { no: 7, tanggal: '2026-02-28', noBukti: 'BP-2026-007', kategori: 'Biaya Asuransi', keterangan: 'Asuransi Pengiriman', vendor: 'PT Asuransi Jasa Indonesia', nilaiBiaya: 2800000 },
            { no: 8, tanggal: '2026-03-05', noBukti: 'BP-2026-008', kategori: 'Biaya Promosi', keterangan: 'Promo Cashback Customer', vendor: 'Internal Promo', nilaiBiaya: 6500000 },
            { no: 9, tanggal: '2026-03-12', noBukti: 'BP-2026-009', kategori: 'Komisi Sales', keterangan: 'Bonus Target Sales', vendor: 'Sales Team', nilaiBiaya: 15000000 },
            { no: 10, tanggal: '2026-03-20', noBukti: 'BP-2026-010', kategori: 'Biaya Pengiriman', keterangan: 'Ongkir Express Service', vendor: 'PT SiCepat Ekspres', nilaiBiaya: 4200000 },
            { no: 11, tanggal: '2026-04-02', noBukti: 'BP-2026-011', kategori: 'Biaya Marketing', keterangan: 'Influencer Marketing', vendor: 'Various Influencers', nilaiBiaya: 10000000 },
            { no: 12, tanggal: '2026-04-15', noBukti: 'BP-2026-012', kategori: 'Biaya Event', keterangan: 'Product Launch Event', vendor: 'PT Event Organizer', nilaiBiaya: 18000000 },
            { no: 13, tanggal: '2026-04-28', noBukti: 'BP-2026-013', kategori: 'Biaya Packaging', keterangan: 'Branded Packaging', vendor: 'CV Premium Pack', nilaiBiaya: 3500000 },
            { no: 14, tanggal: '2026-05-10', noBukti: 'BP-2026-014', kategori: 'Biaya Marketing', keterangan: 'Email Marketing Platform', vendor: 'Mailchimp', nilaiBiaya: 2500000 },
            { no: 15, tanggal: '2026-05-25', noBukti: 'BP-2026-015', kategori: 'Komisi Sales', keterangan: 'Komisi Penjualan Q2', vendor: 'Sales Team', nilaiBiaya: 14000000 },
          ]}
          columns={[
            { key: 'no', label: 'No', width: '80px', align: 'center' },
            { key: 'tanggal', label: 'Tanggal', width: '120px', align: 'center' },
            { key: 'noBukti', label: 'No Bukti', width: '130px', align: 'left' },
            { key: 'kategori', label: 'Kategori', width: '150px', align: 'left' },
            { key: 'keterangan', label: 'Keterangan', align: 'left' },
            { key: 'vendor', label: 'Vendor', align: 'left' },
            { 
              key: 'nilaiBiaya', 
              label: 'Nilai Biaya', 
              width: '160px',
              align: 'right',
              render: (value) => `Rp ${value.toLocaleString('id-ID')}`
            },
          ]}
          pagination={true}
          itemsPerPage={10}
          cardId="biaya-list"
          module="accounting"
        />
      </div>
    </section>
  )
}

export const BiayaPenjualan = withWorkspaceLayout(BiayaPenjualanContent)
