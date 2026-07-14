export type DateFilterOption = "all" | "month" | "year" | "custom";

export interface DateRange {
    startDate: string;
    endDate: string;
}

export interface TrendDataPoint {
    label: string;
    value: number;
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
    module?: "central-dashboard" | "procurement" | "accounting" | "hris";
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
    pr_no_po: Metric;
    po_incomplete: Metric;
    po_no_receiving: Metric;
    receiving_cycle_time: Metric;
    procurement_cycle_time: Metric;
}

export interface ProcurementDashboardData {
  costSaving: MetricCard;
  savingRate: MetricCard;
  otdRate: MetricCard;
  poCycleTime: MetricCard;
  prNoPO: MetricCard;
  poIncomplete: MetricCard;
  poNoReceiving: MetricCard;
  receivingCycleTime: MetricCard;
  procurementCycleTime: MetricCard;
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
    search?: string;
}

// ── Document List Types ──────────────────────────────────────────────

export interface DocumentRow {
    id: number;
    type: "PR" | "PO";
    name: string;
    date: string;
    state: string;
    amount: number;
    department_source_id?: number;
    branch_source_id?: number;
    partner_source_id?: number;
    date_approve?: string;
    date_planned?: string;
    cycle_days?: number;
    amount_untaxed?: number;
    amount_saved_from_cost_savings?: number;
    pr_estimated_total?: number;
    from_purchase_request?: boolean;
    is_goods_orders?: boolean;
    product_type?: string;
    pr_confirm_date?: string;
    origin?: string;
}

export interface PaginatedDocuments {
    total: number;
    page: number;
    limit: number;
    items: DocumentRow[];
}

/** Maps tile card IDs to backend metric query param values */
export type MetricType =
    | "pr_no_po"
    | "po_incomplete"
    | "po_no_receiving"
    | "cost_saving"
    | "saving_rate"
    | "otd_rate"
    | "po_cycle_time"
    | "receiving_cycle_time"
    | "procurement_cycle_time";