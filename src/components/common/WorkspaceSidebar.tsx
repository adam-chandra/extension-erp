import {
  Circle,
  ChartPie,
  Tag,
  Building,
  Wallet,
  ChevronDown,
  ChevronRight,
  Users,
  ShoppingBasket,
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { NavLink } from 'react-router-dom'
import type { ModuleFilter } from '@/types/dashboard'
import type { UserCompany } from '@/types/auth'
import { ROUTES } from '@/config/routes'
import { useState } from 'react'

interface WorkspaceSidebarProps {
  sidebarOpen: boolean
  isSidebarCollapsed: boolean
  selectedCompany: string
  selectedModule: ModuleFilter
  companies: UserCompany[]
  showCentralDashboard: boolean
  showProcurement: boolean
  showAccounting: boolean
  showHRIS: boolean
  showAsset: boolean
  onCompanyChange: (value: string) => void
  onModuleChange: (value: ModuleFilter) => void
}

export function WorkspaceSidebar({
  sidebarOpen,
  isSidebarCollapsed,
  selectedCompany,
  selectedModule,
  companies,
  showCentralDashboard,
  showProcurement,
  showAccounting,
  showHRIS,
  showAsset,
  onCompanyChange,
  onModuleChange,
}: WorkspaceSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<{
    procurement: boolean
    accounting: boolean
    hris: boolean
    asset: boolean
  }>({
    procurement: true,
    accounting: true,
    hris: true,
    asset: true,
  })

  const toggleModule = (module: 'procurement' | 'accounting' | 'hris' | 'asset') => {
    setExpandedModules((prev) => ({
      ...prev,
      [module]: !prev[module],
    }))
  }

  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-40 w-72 transform overflow-y-auto bg-slate-900 text-slate-100 shadow-2xl transition-all duration-300 lg:static lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72',
      ].join(' ')}
    >
      <div className="flex items-center gap-3 border-b border-slate-700 bg-slate-950 p-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ed8c2d] text-sm font-bold text-white">
          E
        </div>
        {!isSidebarCollapsed ? (
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em]">Extension ERP</p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
              <Circle className="h-2.5 w-2.5 fill-emerald-400" />
              Connected
            </p>
          </div>
        ) : null}
      </div>

      <div
        className={
          isSidebarCollapsed
            ? 'hidden lg:hidden'
            : 'space-y-4 border-b border-slate-700 bg-slate-800/70 p-4'
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="company-selector" className="text-[11px] uppercase tracking-wider text-slate-300">
            Akses Company
          </Label>
          <Select value={selectedCompany} onValueChange={onCompanyChange}>
            <SelectTrigger
              id="company-selector"
              className="h-10 w-full border-slate-600 bg-slate-700 text-white focus-visible:border-[#ed8c2d] focus-visible:ring-[#ed8c2d]/35 [&_svg]:text-slate-300"
            >
              <SelectValue placeholder="-- Pilih company --" />
            </SelectTrigger>
            <SelectContent className="border-slate-600 bg-slate-800 text-slate-100">
              {companies.length === 0 ? (
                <div className="px-3 py-2 text-xs text-slate-400">Belum ada akses company</div>
              ) : (
                companies.map((company) => (
                  <SelectItem
                    key={company.sourceId}
                    value={String(company.sourceId)}
                    className="data-[highlighted]:bg-[#ed8c2d]/20 data-[highlighted]:text-[#ffdcb9] data-[state=checked]:bg-[#ed8c2d]/25 data-[state=checked]:text-[#ffdcb9]"
                  >
                    {company.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="module-selector" className="text-[11px] uppercase tracking-wider text-slate-300">
            Akses Modul
          </Label>
          <Select value={selectedModule} onValueChange={(value: string) => onModuleChange(value as ModuleFilter)}>
            <SelectTrigger
              id="module-selector"
              className="h-10 w-full border-slate-600 bg-slate-700 text-white focus-visible:border-[#ed8c2d] focus-visible:ring-[#ed8c2d]/35 [&_svg]:text-slate-300"
            >
              <SelectValue placeholder="Pilih modul" />
            </SelectTrigger>
            <SelectContent className="border-slate-600 bg-slate-800 text-slate-100">
              {/* [PHASE1 hidden]
              <SelectItem
                value="all"
                className="data-[highlighted]:bg-[#ed8c2d]/20 data-[highlighted]:text-[#ffdcb9] data-[state=checked]:bg-[#ed8c2d]/25 data-[state=checked]:text-[#ffdcb9]"
              >
                Semua Modul
              </SelectItem>
              <SelectItem
                value="central-dashboard"
                className="data-[highlighted]:bg-[#ed8c2d]/20 data-[highlighted]:text-[#ffdcb9] data-[state=checked]:bg-[#ed8c2d]/25 data-[state=checked]:text-[#ffdcb9]"
              >
                Central Dashboard
              </SelectItem>
              */}
              <SelectItem
                value="procurement"
                className="data-[highlighted]:bg-[#ed8c2d]/20 data-[highlighted]:text-[#ffdcb9] data-[state=checked]:bg-[#ed8c2d]/25 data-[state=checked]:text-[#ffdcb9]"
              >
                Procurement
              </SelectItem>
              <SelectItem
                value="accounting"
                className="data-[highlighted]:bg-[#ed8c2d]/20 data-[highlighted]:text-[#ffdcb9] data-[state=checked]:bg-[#ed8c2d]/25 data-[state=checked]:text-[#ffdcb9]"
              >
                Accounting / Finance
              </SelectItem>
              <SelectItem
                value="hris"
                className="data-[highlighted]:bg-[#ed8c2d]/20 data-[highlighted]:text-[#ffdcb9] data-[state=checked]:bg-[#ed8c2d]/25 data-[state=checked]:text-[#ffdcb9]"
              >
                HRIS
              </SelectItem>
              <SelectItem
                value="asset"
                className="data-[highlighted]:bg-[#ed8c2d]/20 data-[highlighted]:text-[#ffdcb9] data-[state=checked]:bg-[#ed8c2d]/25 data-[state=checked]:text-[#ffdcb9]"
              >
                Asset
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <nav className="space-y-1 p-3">
        {showCentralDashboard ? (
          <NavLink
            to={ROUTES.DASHBOARD}
            end
            className={({ isActive }) =>
              [
                'flex w-full items-center rounded-lg py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-[#ed8c2d] text-white'
                  : 'text-slate-200 hover:bg-slate-700',
                isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3',
              ].join(' ')
            }
            title="Central Dashboard"
          >
            <ChartPie className="h-4 w-4" />
            {!isSidebarCollapsed ? 'Central Dashboard' : null}
          </NavLink>
        ) : null}

        {showProcurement ? (
          <div className="space-y-1 pt-3">
            {!isSidebarCollapsed ? (
              <button
                onClick={() => toggleModule('procurement')}
                className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 transition hover:bg-slate-700/50 hover:text-slate-300"
              >
                <span>Modul Procurement</span>
                {expandedModules.procurement ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            ) : null}
            {expandedModules.procurement && (
              <>
                <NavLink
                  to={ROUTES.DASHBOARD_PROCUREMENT}
                  className={({ isActive }) =>
                    [
                      'flex w-full items-center rounded-lg py-2 text-sm transition',
                      isActive
                        ? 'bg-[#ed8c2d] text-white'
                        : 'text-slate-200 hover:bg-slate-700',
                      isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3',
                    ].join(' ')
                  }
                  title="Dashboard Procurement"
                >
                  <Building className="h-4 w-4" />
                  {!isSidebarCollapsed ? 'Dashboard Procurement' : null}
                </NavLink>
                <NavLink
                  to={ROUTES.PURCHASE}
                  className={({ isActive }) =>
                    [
                      'flex w-full items-center rounded-lg py-2 text-sm transition',
                      isActive
                        ? 'bg-[#ed8c2d] text-white'
                        : 'text-slate-200 hover:bg-slate-700',
                      isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3',
                    ].join(' ')
                  }
                  title="Purchase Order"
                >
                  <ShoppingBasket className="h-4 w-4" />
                  {!isSidebarCollapsed ? 'Purchase Order (PO)' : null}
                </NavLink>
              </>
            )}
          </div>
        ) : null}

        {showAccounting ? (
          <div className="space-y-1 pt-3">
            {!isSidebarCollapsed ? (
              <button
                onClick={() => toggleModule('accounting')}
                className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 transition hover:bg-slate-700/50 hover:text-slate-300"
              >
                <span>Modul Accounting</span>
                {expandedModules.accounting ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            ) : null}
            {expandedModules.accounting && (
              <>
                <NavLink
                  to={ROUTES.DASHBOARD_ACCOUNTING}
                  className={({ isActive }) =>
                    [
                      'flex w-full items-center rounded-lg py-2 text-sm transition',
                      isActive
                        ? 'bg-[#ed8c2d] text-white'
                        : 'text-slate-200 hover:bg-slate-700',
                      isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3',
                    ].join(' ')
                  }
                  title="Dashboard Finance & Accounting"
                >
                  <Wallet className="h-4 w-4" />
                  {!isSidebarCollapsed ? 'Dashboard Finance & Accounting' : null}
                </NavLink>
                {/* <NavLink
                  to={ROUTES.INVOICE}
                  className={({ isActive }) =>
                    [
                      'flex w-full items-center rounded-lg py-2 text-sm transition',
                      isActive
                        ? 'bg-[#ed8c2d] text-white'
                        : 'text-slate-200 hover:bg-slate-700',
                      isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3',
                    ].join(' ')
                  }
                  title="Invoice Tracking"
                >
                  <FileText className="h-4 w-4" />
                  {!isSidebarCollapsed ? 'Invoice Tracking' : null}
                </NavLink> */}
              </>
            )}
          </div>
        ) : null}

        {showHRIS ? (
          <div className="space-y-1 pt-3">
            {!isSidebarCollapsed ? (
              <button
                onClick={() => toggleModule('hris')}
                className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 transition hover:bg-slate-700/50 hover:text-slate-300"
              >
                <span>Modul HRIS</span>
                {expandedModules.hris ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            ) : null}
            {expandedModules.hris && (
              <NavLink
                to={ROUTES.DASHBOARD_HRIS}
                className={({ isActive }) =>
                  [
                    'flex w-full items-center rounded-lg py-2 text-sm transition',
                    isActive
                      ? 'bg-[#ed8c2d] text-white'
                      : 'text-slate-200 hover:bg-slate-700',
                    isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3',
                  ].join(' ')
                }
                title="Dashboard HRIS"
              >
                <Users className="h-4 w-4" />
                {!isSidebarCollapsed ? 'Dashboard HRIS' : null}
              </NavLink>
            )}
          </div>
        ) : null}

        {showAsset ? (
          <div className="space-y-1 pt-3">
            {!isSidebarCollapsed ? (
              <button
                onClick={() => toggleModule('asset')}
                className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 transition hover:bg-slate-700/50 hover:text-slate-300"
              >
                <span>Modul Asset</span>
                {expandedModules.asset ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            ) : null}
            {expandedModules.asset && (
              <NavLink
                to={ROUTES.DASHBOARD_ASSET}
                className={({ isActive }) =>
                  [
                    'flex w-full items-center rounded-lg py-2 text-sm transition',
                    isActive
                      ? 'bg-[#ed8c2d] text-white'
                      : 'text-slate-200 hover:bg-slate-700',
                    isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3',
                  ].join(' ')
                }
                title="Dashboard Asset"
              >
                <Users className="h-4 w-4" />
                {!isSidebarCollapsed ? 'Dashboard Asset' : null}
              </NavLink>
            )}
          </div>
        ) : null}

        <div className="space-y-1 pt-3">
          {!isSidebarCollapsed ? (
            <button
              onClick={() => toggleModule('asset')}
              className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 transition hover:bg-slate-700/50 hover:text-slate-300"
            >
              <span>Asset</span>
              {expandedModules.asset ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          ) : null}
          {expandedModules.asset && (
            <NavLink
              to={ROUTES.LABEL}
              className={({ isActive }) =>
                [
                  'flex w-full items-center rounded-lg py-2 text-sm transition',
                  isActive
                    ? 'bg-[#ed8c2d] text-white'
                    : 'text-slate-200 hover:bg-slate-700',
                  isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3',
                ].join(' ')
              }
              title="Label Asset"
            >
              <Tag className="h-4 w-4" />
              {!isSidebarCollapsed ? 'Label Asset' : null}
              {!isSidebarCollapsed ? (
                <span className="ml-auto rounded bg-[#ed8c2d]/20 px-1.5 py-0.5 text-[10px] text-[#ed8c2d]">
                  MVP
                </span>
              ) : null}
            </NavLink>
          )}
        </div>
      </nav>
    </aside>
  )
}
