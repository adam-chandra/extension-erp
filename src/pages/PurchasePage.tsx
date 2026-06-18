import { ShoppingBasket } from 'lucide-react'
import { ModuleCard } from '@/components/common/ModuleCard'
import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from '@/components/common/withWorkspaceLayout'

function PurchaseContent(_: WorkspaceLayoutInjectedProps) {
  return (
    <section className="flex-1 p-4 sm:p-6">
      <ModuleCard
        title="Purchase Order"
        subtitle="Halaman Purchase"
        description="Ini adalah page Purchase yang terpisah. Konten bisa dihubungkan ke list PO, approval, dan analitik procurement."
        icon={ShoppingBasket}
        iconWrapperClassName="bg-amber-100 text-amber-700"
        iconClassName="h-5 w-5"
      />
    </section>
  )
}

export const PurchasePage = withWorkspaceLayout(PurchaseContent)
