import { apiClient } from '@/lib/axios'

interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
}

export interface HrisKPI {
  totalEmployees: number
  attendanceRate: number
  newHires: number
  turnoverRate: number
}

export interface HrisDeptHeadcount {
  departmentId: number
  departmentName: string
  count: number
}

export interface HrisMonthlyCount {
  month: string // YYYY-MM
  count: number
}

export interface HrisDeptSalary {
  departmentId: number
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
  deptHeadcount: HrisDeptHeadcount[]
  recruitment: HrisMonthlyCount[]
  salaryByDept: HrisDeptSalary[]
  attendanceTrend: HrisAttendanceTrendPt[]
  workforceTrend: HrisWorkforceTrendPt[]
}

export const hrisService = {
  async dashboard(companyId: number): Promise<HrisDashboard> {
    const { data } = await apiClient.get<ApiEnvelope<HrisDashboard>>('/hris/dashboard', {
      params: { companyId },
    })
    return data.data
  },
}
