import { Building } from 'lucide-react'
import { ModuleCard } from '@/components/common/ModuleCard'
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from '@/components/common/withWorkspaceLayout'

function InvoiceContent(_: WorkspaceLayoutInjectedProps) {
  return (
    <section className="flex-1 p-4 sm:p-6">
      <ModuleCard
        title="Invoice Tracking"
        subtitle="Halaman Invoice"
        description="Ini adalah page Invoice yang terpisah. Konten siap untuk monitoring invoice, due date, dan status pembayaran."
        icon={Building}
        iconWrapperClassName="bg-emerald-100 text-emerald-700"
        iconClassName="h-5 w-5"
      />
    </section>
  )
}

export const InvoicePage = withWorkspaceLayout(InvoiceContent)
