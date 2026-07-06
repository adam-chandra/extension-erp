# CHANGELOG & DOKUMENTASI PERUBAHAN

## Modul: Procurement Dashboard (Front-End Extension)

Dokumen ini mencatat seluruh riwayat perubahan kode (changelog) dan dokumentasi teknis terkait pengembangan **Dashboard Procurement** pada repositori `fe-extension-erp` di branch `feat/purchase-dashboard`.

---

## Ringkasan Rilis (Release Summary)

- **Tanggal Perubahan:** 6 Juli 2026
- **Status:** Development (Staged & Ready to Pull Request)
- **Branch:** `feat/purchase-dashboard`
- **Fokus Utama:**
  1. Transformasi halaman dashboard statis menjadi berbasis data dinamis.
  2. Implementasi Service Layer API & custom hooks React Query.
  3. Desain mekanisme fallback data mock lokal saat backend luring (offline).
  4. Penyempurnaan visualisasi grafik (Charts) dan kartu KPI (Tile Card).
  5. Pengaktifan rute & integrasi navigasi global di Sidebar.

---

## Detail Perubahan per Berkas (File-by-File Changes)

### 1. Struktur Navigasi & Workspace Context

- **`src/context/WorkspaceContext.tsx`**
  - **Perubahan:** Memperluas validasi `ModuleFilter` di local storage untuk mengizinkan modul `procurement` dan `asset`.
  - **Tujuan:** Menghindari reset modul default ke 'accounting' saat berpindah halaman ke area kerja Procurement.
- **`src/components/common/withWorkspaceLayout.tsx`**
  - **Perubahan:** Mengaktifkan flag `showProcurement` berdasarkan `selectedModule` yang aktif. Mendaftarkan rute procurement (`ROUTES.DASHBOARD_PROCUREMENT` dan `ROUTES.PURCHASE`) agar sistem layout tidak memblokir atau melakukan redirect salah sasaran.
- **`src/components/common/WorkspaceSidebar.tsx`**
  - **Perubahan:** Mengaktifkan dropdown navigasi menu modul Procurement di sidebar, serta membuka blokir link `/purchase-order` (Purchase Order (PO)).

### 2. Tipe Data (Types) & Model Kontrak API

- **`src/types/procurement.ts`** _(Baru)_
  - **Konten:**
    - `DateFilterOption`: Opsi filter periode (`all`, `month`, `year`, `custom`).
    - `DateRange`: Rentang tanggal custom (`startDate`, `endDate`).
    - `Metric` & `MetricCard`: Struktur data untuk Tile KPI beserta properti dekoratif (ikon, warna latar belakang).
    - `ProcurementDashboardResponse`: Kontrak response API dashboard yang dikirimkan oleh Backend (`cost_saving`, `saving_rate`, `otd_rate`, `po_cycle_time`).
    - `PurchaseTrendYTDDataPoint`: Struktur data pembanding akumulasi belanja tahun ini vs tahun lalu.

### 3. Service Layer & Integrasi API

- **`src/services/procurement.service.ts`** _(Baru)_
  - **Konten:**
    - `procurementService`: Object service berisi metode `getDashboard`, `getPOCycleTimeTrend`, dan `getPurchaseTrendYTD` untuk melakukan HTTP GET request menggunakan axios `apiClient`.
    - `mergeWithStyling`: Fungsi internal untuk menggabungkan data mentah backend (yang murni berisi metrik angka/teks) dengan konfigurasi visual UI (seperti ikon Lucide, kelas warna latar ikon, dan ID card unik).
    - **Mekanisme Resiliensi:** Mengimplementasikan blok `try-catch` di setiap metode API call. Jika server mengembalikan error (misal status code 4xx, 5xx, atau network error), service secara otomatis mengembalikan fallback data mock dari `src/data/procurement-mock.ts`.

### 4. Custom Hooks & Query Management

- **`src/hooks/useProcurementDashboard.ts`** _(Baru)_
  - **Konten:**
    - `procurementKeys`: Factory object untuk mendefinisikan Query Keys terstruktur (`procurementKeys.all`, `procurementKeys.dashboard`, dll.). Menjamin cache React Query ter-invalidasi secara presisi ketika `companyId` atau filter parameter berubah.
    - Hooks dibungkus dalam:
      - `useProcurementDashboard(companyId, filters)`
      - `usePOCycleTimeTrend(companyId, filters)`
      - `usePurchaseTrendYTD(companyId, filters)`
    - **Konfigurasi default:** `staleTime` diatur selama 60 detik (1 menit) dan `enabled` hanya bernilai true jika `companyId` tidak bernilai null/empty.

### 5. Data Mock Terpusat (Centralized Mock)

- **`src/data/procurement-mock.ts`** _(Baru)_
  - **Konten:**
    - `fallbackDashboard`: Data default awal dengan nilai nol (`0`) untuk metrik Cost Saving, Saving Rate, OTD Rate, dan PO Cycle Time.
    - `procurementMetricConfig`: Peta penata gaya (style configuration) yang mendefinisikan warna & ikon untuk masing-masing kartu KPI.

### 6. Komponen Visual & Presentasi Grafik

- **`src/components/common/TileCard.tsx`**
  - **Perubahan:** Menambahkan parameter opsional `unit` dan `remarks`.
  - **Efek UI:** Nilai KPI dapat bersandingan dengan satuannya di bawah nilai utama, dan terdapat footer garis pembatas tipis yang menampilkan catatan deskriptif/keterangan metrik (misal: _"Nilai ekonomis hasil negosiasi PR vs PO"_).
- **`src/components/common/SingleSeriesLineChartCard.tsx`**
  - **Perubahan:**
    - Menambahkan opsional parameter `targetValue` dan `targetLabel`.
    - Menggambar `ReferenceLine` putus-putus horizontal pada grafik area jika `targetValue` ditentukan (misal untuk menetapkan KPI target PO Cycle Time ≤ 5.0 hari).
    - Memodifikasi properti visual dot agar memiliki ring border putih jika `showDataLabels` aktif.
- **`src/components/common/MultiSeriesLineChartCard.tsx`**
  - **Perubahan:**
    - Menambahkan dukungan `yAxisFormatter` kustom.
    - Mengizin kan modifikasi garis legenda putus-putus secara dinamis berdasarkan data payload.
    - Mendukung properti label titik data langsung di atas garis grafik.

### 7. Halaman Utama Modul (Page) & Filter Tanggal

- **`src/components/common/DateFilterDropdown.tsx`** _(Baru)_
  - **Konten:** Komponen dropdown pemilih tanggal terpadu. Menyediakan tombol kalender interaktif untuk memilih preset "All Time", "This Month", "This Year", atau "Custom Range" yang membuka form input kalender tanggal mulai & tanggal selesai.
- **`src/pages/ProcurementDashboardPage.tsx`**
  - **Perubahan:**
    - Mengganti import komponen statis dan data statis lama dengan data dinamis hasil query `useProcurementDashboard`, `usePOCycleTimeTrend`, dan `usePurchaseTrendYTD`.
    - Memasang state lokal untuk `dateFilter` dan `customRange` yang terikat pada komponen `DateFilterDropdown`.
    - Menambahkan spinner loader asinkron dengan animasi memutar (spin ring) saat data grafik sedang di-fetch.
    - Menggunakan model rendering map dinamis untuk Tile KPI Cards.

---

## Alur Integrasi Backend (Backend Integration Flow)

Ketika backend API di branch `feat/procurement-dashboard` sudah dideploy dan aktif, integrasi dapat langsung berjalan otomatis berkat pemisahan arsitektur data:

1. **Pengambilan Data Bisnis:**
   - Backend mengembalikan JSON ter-envelope sesuai kontrak `ProcurementDashboardResponse` di endpoint `GET /api/procurement/dashboard?companyId={id}&period={period}&start={start}&end={end}`.
2. **Dekorasi UI di Frontend:**
   - File `procurement.service.ts` memanggil backend.
   - `mergeWithStyling()` menambahkan properti visual (misalnya warna latar `bg-blue-100`, ikon `ShoppingCart`) ke metrik bisnis yang diterima.
3. **Penyajian Data:**
   - Data dilemparkan ke hook React Query lalu disajikan secara responsif pada grafik Recharts dan kartu KPI.
