import {
  withWorkspaceLayout,
  type WorkspaceLayoutInjectedProps,
} from '@/components/common/withWorkspaceLayout'

function LabelContent(_: WorkspaceLayoutInjectedProps) {
  return (
    <section className="flex-1 p-4 sm:p-6">
      <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-800">Label Asset</h2>
        <p className="mt-2 text-sm text-slate-600">
          Ini adalah page Label terpisah. Area ini bisa dipakai untuk cetak label, generate barcode, dan pencarian asset.
        </p>
      </article>
    </section>
  )
}

export const LabelPage = withWorkspaceLayout(LabelContent)
