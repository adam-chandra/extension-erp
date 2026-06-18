import type { LucideIcon } from 'lucide-react'
import { Hourglass } from 'lucide-react'

interface ModuleCardProps {
  title: string
  subtitle: string
  description: string
  icon: LucideIcon
  iconWrapperClassName: string
  iconClassName: string
}

export function ModuleCard({
  title,
  subtitle,
  description,
  icon: Icon,
  iconWrapperClassName,
  iconClassName,
}: ModuleCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={[
              'flex h-10 w-10 items-center justify-center rounded-lg',
              iconWrapperClassName,
            ].join(' ')}
          >
            <Icon className={iconClassName} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 sm:text-base">{title}</h3>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center">
        <Hourglass className="mx-auto h-8 w-8 animate-pulse text-slate-400" />
        <p className="mt-3 text-sm font-semibold text-slate-700">Coming Soon</p>
        <p className="mx-auto mt-1 max-w-xs px-4 text-xs text-slate-500">{description}</p>
      </div>
    </article>
  )
}
