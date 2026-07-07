import { apiClient } from '@/lib/axios'

interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
}

export interface HrisKPI {
  totalEmployees: number
  attendanceRateYtd: number     // avg rate for period
  attendanceRatePrevYtd: number // same period prev year
  totalSakit: number
  totalCuti: number
  totalIzin: number
  totalAlfa: number
  totalTelat: number
}

export interface HrisSCIAMonthlyPt {
  month: string // YYYY-MM
  sakit: number
  cuti: number
  izin: number
  alfa: number
}

export interface HrisAttendanceMonthlyPt {
  month: string  // YYYY-MM
  rate: number   // %
  lateCount: number
}

export interface HrisDashboard {
  companyId: number
  kpi: HrisKPI
  sciaMonthly: HrisSCIAMonthlyPt[]
  attendanceMonthly: HrisAttendanceMonthlyPt[]
}

export const hrisService = {
  async dashboard(companyId: number, year: number): Promise<HrisDashboard> {
    const { data } = await apiClient.get<ApiEnvelope<HrisDashboard>>('/hris/dashboard', {
      params: { companyId, year },
    })
    return data.data
  },
}
