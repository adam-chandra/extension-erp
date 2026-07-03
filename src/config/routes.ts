export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  DASHBOARD_PROCUREMENT: '/dashboard/procurement',
  DASHBOARD_ACCOUNTING: '/dashboard/accounting',
  DASHBOARD_HRIS: '/dashboard/hris',
  DASHBOARD_ASSET: '/dashboard/asset',
  PURCHASE: '/dashboard/purchase',
  INVOICE: '/dashboard/invoice',
  LABEL: '/dashboard/label',
  REVENUE: '/dashboard/revenue',
  POTONGAN_PENJUALAN: '/dashboard/potongan-penjualan',
  RETUR_PENJUALAN: '/dashboard/retur-penjualan',
  BIAYA_PENJUALAN: '/dashboard/biaya-penjualan',
  NOT_FOUND: '*',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
