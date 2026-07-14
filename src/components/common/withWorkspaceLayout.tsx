import { useEffect, useMemo, useState, type ComponentType } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/context/WorkspaceContext";
import type { ModuleFilter } from "@/types/dashboard";
import { WorkspaceHeader } from "@/components/common/WorkspaceHeader";
import { WorkspaceSidebar } from "@/components/common/WorkspaceSidebar";
import { ROUTES } from "@/config/routes";

export interface WorkspaceLayoutInjectedProps {
  showCentralDashboard: boolean;
  showProcurement: boolean;
  showAccounting: boolean;
  showHRIS: boolean;
  showAsset: boolean;
  selectedCompany?: string;
  selectedModule?: ModuleFilter;
}

export function withWorkspaceLayout<P extends WorkspaceLayoutInjectedProps>(
  WrappedComponent: ComponentType<P>,
) {
  function WithWorkspaceLayoutComponent(
    props: Omit<P, keyof WorkspaceLayoutInjectedProps>,
  ) {
    const { user, logout } = useAuth();
    const {
      selectedCompany,
      selectedModule,
      setSelectedCompany,
      setSelectedModule,
    } = useWorkspace();
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] =
      useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    const companies = useMemo(() => user?.companies ?? [], [user]);

    // Auto-pick the default (or first) company when none is selected yet, or
    // when the stored selection no longer belongs to the current user.
    useEffect(() => {
      if (companies.length === 0) return;
      const stored = selectedCompany;
      const validIds = new Set(companies.map((c) => String(c.sourceId)));
      if (stored && validIds.has(stored)) return;
      const fallback = companies.find((c) => c.isDefault) ?? companies[0];
      setSelectedCompany(String(fallback.sourceId));
    }, [companies, selectedCompany, setSelectedCompany]);

    // Central dashboard is still hidden for now, while module-level dashboards
    // (including procurement) are exposed based on selected module.
    const showCentralDashboard = false;
    const showProcurement =
      selectedModule === "all" || selectedModule === "procurement";
    const showAccounting =
      selectedModule === "all" || selectedModule === "accounting";
    const showHRIS = selectedModule === "all" || selectedModule === "hris";
    const showAsset = selectedModule === "all" || selectedModule === "asset";
    // const showCentralDashboard =
    //   selectedModule === 'all' || selectedModule === 'central-dashboard'
    // const showProcurement =
    //   selectedModule === 'all' || selectedModule === 'procurement'

    const companyBadge = useMemo(() => {
      if (!selectedCompany) return "Belum Dipilih";
      const match = companies.find(
        (c) => String(c.sourceId) === selectedCompany,
      );
      return match?.name ?? "Belum Dipilih";
    }, [selectedCompany, companies]);

    const moduleBadge = useMemo(() => {
      if (selectedModule === "all") return "Semua Modul";
      if (selectedModule === "central-dashboard") return "Central Dashboard";
      if (selectedModule === "procurement") return "Procurement";
      if (selectedModule === "accounting") return "Accounting";
      if (selectedModule === "hris") return "HRIS";
      if (selectedModule === "asset") return "Asset";
      return "Unknown Module";
    }, [selectedModule]);

    // Redirect to module dashboard when specific module is selected
    // But only if not already on a page within that module
    useEffect(() => {
      const currentPath = location.pathname;

      // Define accounting module pages
      const accountingPages = [
        ROUTES.DASHBOARD_ACCOUNTING,
        ROUTES.REVENUE,
        ROUTES.POTONGAN_PENJUALAN,
        ROUTES.RETUR_PENJUALAN,
        ROUTES.BIAYA_PENJUALAN,
        ROUTES.INVOICE,
        ROUTES.PROFIT_LOSS,
        ROUTES.BALANCE_SHEET,
      ] as string[]

      // Define procurement module pages
      const procurementPages = [
        ROUTES.DASHBOARD_PROCUREMENT,
        ROUTES.PROCUREMENT_DETAIL,
        ROUTES.PURCHASE,
      ] as string[];

      // Define HRIS module pages
      const hrisPages = [ROUTES.DASHBOARD_HRIS] as string[];

      // Define Asset module pages
      const assetPages = [ROUTES.DASHBOARD_ASSET] as string[];

      if (
        selectedModule === "accounting" &&
        !accountingPages.includes(currentPath)
      ) {
        navigate(ROUTES.DASHBOARD_ACCOUNTING);
      } else if (
        selectedModule === "procurement" &&
        !procurementPages.includes(currentPath)
      ) {
        navigate(ROUTES.DASHBOARD_PROCUREMENT);
      } else if (
        selectedModule === "hris" &&
        !hrisPages.includes(currentPath)
      ) {
        navigate(ROUTES.DASHBOARD_HRIS);
      } else if (
        selectedModule === "asset" &&
        !assetPages.includes(currentPath)
      ) {
        navigate(ROUTES.DASHBOARD_ASSET);
      }
      // [PHASE1 hidden] central dashboard redirect disabled
      // if (selectedModule === 'central-dashboard' && currentPath !== ROUTES.DASHBOARD) {
      //   navigate(ROUTES.DASHBOARD)
      // }
      // Don't redirect for 'all' - let user stay on current page
    }, [selectedModule, navigate, location.pathname]);

    useEffect(() => {
      const onFullscreenChange = () =>
        setIsFullscreen(!!document.fullscreenElement);
      document.addEventListener("fullscreenchange", onFullscreenChange);
      return () =>
        document.removeEventListener("fullscreenchange", onFullscreenChange);
    }, []);

    const toggleFullscreen = async () => {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      await document.documentElement.requestFullscreen();
    };

    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        {sidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/55 lg:hidden"
          />
        ) : null}

        <div className="flex min-h-screen">
          <WorkspaceSidebar
            sidebarOpen={sidebarOpen}
            isSidebarCollapsed={isSidebarCollapsed}
            selectedCompany={selectedCompany}
            selectedModule={selectedModule}
            companies={companies}
            showCentralDashboard={showCentralDashboard}
            showProcurement={showProcurement}
            showAccounting={showAccounting}
            showHRIS={showHRIS}
            showAsset={showAsset}
            onCompanyChange={setSelectedCompany}
            onModuleChange={setSelectedModule}
          />

          <main className="flex min-w-0 flex-1 flex-col">
            <WorkspaceHeader
              companyBadge={companyBadge}
              moduleBadge={moduleBadge}
              isFullscreen={isFullscreen}
              isSidebarCollapsed={isSidebarCollapsed}
              userName={user?.name ?? "Administrator"}
              userEmail={user?.email ?? "admin@erp.com"}
              onOpenMobileSidebar={() => setSidebarOpen(true)}
              onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
              onToggleFullscreen={() => void toggleFullscreen()}
              onLogout={() => void logout()}
            />

            <WrappedComponent
              {...(props as P)}
              showCentralDashboard={showCentralDashboard}
              showProcurement={showProcurement}
              showAccounting={showAccounting}
              showHRIS={showHRIS}
              showAsset={showAsset}
              selectedCompany={selectedCompany}
              selectedModule={selectedModule}
            />
          </main>
        </div>
      </div>
    );
  }

  const wrappedName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  WithWorkspaceLayoutComponent.displayName = `withWorkspaceLayout(${wrappedName})`;

  return WithWorkspaceLayoutComponent;
}
