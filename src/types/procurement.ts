export type DateFilterOption = "all" | "month" | "year" | "custom";

export interface DateRange {
    startDate: string;
    endDate: string;
}

export interface Metric {
    title: string;
    value: number;
    unit?: string;
    remarks?: string;
}

export interface MetricCard extends Metric {
    icon: string;
    iconBgColor: string;
    iconColor: string;
    cardId: string;
}

export interface ProcurementDashboardResponse {
    company_id: number;
    period?: {
        code: string;
        start: string;
        end: string;
    };
    cost_saving: Metric;
    saving_rate: Metric;
    otd_rate: Metric;
    po_cycle_time: Metric;
}

export interface PurchaseTrendYTDDataPoint {
    label: string;
    ytd_this_year: number;
    ytd_last_year: number;
    [key: string]: number | string;
}

export interface ProcurementFilters {
    dateFilter: DateFilterOption;
    dateRange?: DateRange;
    companyId: string;
}