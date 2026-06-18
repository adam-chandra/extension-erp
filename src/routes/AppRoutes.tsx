import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { PublicOnlyRoute } from '@/routes/PublicOnlyRoute'
import { LoginPage } from '@/pages/LoginPage'
import { CentralDashboard } from '@/pages/CentralDashboard'
import { ProcurementDashboardPage } from '@/pages/ProcurementDashboardPage'
import { FinanceAccountingDashboardPage } from '@/pages/FinanceAccountingDashboardPage'
import HRISDashboardPage from '@/pages/HRISDashboardPage'
import { PurchasePage } from '@/pages/PurchasePage'
import { InvoicePage } from '@/pages/InvoicePage'
import { LabelPage } from '@/pages/LabelPage'
import { RevenuePage } from '@/pages/RevenuePage'
import { PotonganPenjualan } from '@/pages/PotonganPenjualan'
import { ReturPenjualan } from '@/pages/ReturPenjualan'
import { BiayaPenjualan } from '@/pages/BiayaPenjualan'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.DASHBOARD} element={<CentralDashboard />} />
        <Route path={ROUTES.DASHBOARD_PROCUREMENT} element={<ProcurementDashboardPage />} />
        <Route path={ROUTES.DASHBOARD_ACCOUNTING} element={<FinanceAccountingDashboardPage />} />
        <Route path={ROUTES.DASHBOARD_HRIS} element={<HRISDashboardPage />} />
        <Route path={ROUTES.PURCHASE} element={<PurchasePage />} />
        <Route path={ROUTES.INVOICE} element={<InvoicePage />} />
        <Route path={ROUTES.LABEL} element={<LabelPage />} />
        <Route path={ROUTES.REVENUE} element={<RevenuePage />} />
        <Route path={ROUTES.POTONGAN_PENJUALAN} element={<PotonganPenjualan />} />
        <Route path={ROUTES.RETUR_PENJUALAN} element={<ReturPenjualan />} />
        <Route path={ROUTES.BIAYA_PENJUALAN} element={<BiayaPenjualan />} />
      </Route>

      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  )
}
