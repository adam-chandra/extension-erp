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
  newHires?: number
  turnoverRate?: number
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

export interface HrisDeptHeadcountPt {
  departmentName: string
  count: number
}

export interface HrisRecruitmentPt {
  month: string
  count: number
}

export interface HrisSalaryByDeptPt {
  departmentName: string
  totalSalary: number
}

export interface HrisAttendanceTrendPt {
  month: string
  rate: number
}

export interface HrisWorkforceTrendPt {
  month: string
  employees: number
  hires: number
  exits: number
}

export interface HrisDashboard {
  companyId: number
  kpi: HrisKPI
  sciaMonthly: HrisSCIAMonthlyPt[]
  attendanceMonthly: HrisAttendanceMonthlyPt[]
  deptHeadcount?: HrisDeptHeadcountPt[]
  recruitment?: HrisRecruitmentPt[]
  salaryByDept?: HrisSalaryByDeptPt[]
  attendanceTrend?: HrisAttendanceTrendPt[]
  workforceTrend?: HrisWorkforceTrendPt[]
}

export const hrisService = {
  async dashboard(companyId: number, year: number): Promise<HrisDashboard> {
    const { data } = await apiClient.get<ApiEnvelope<HrisDashboard>>('/hris/dashboard', {
      params: { companyId, year },
    })
    return data.data
  },
}
