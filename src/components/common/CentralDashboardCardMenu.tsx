import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Trash2 } from 'lucide-react'
import { useDashboardCards } from '@/context/DashboardCardsContext'

interface CentralDashboardCardMenuProps {
  cardId: string
}

export function CentralDashboardCardMenu({ cardId }: CentralDashboardCardMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { removeCard } = useDashboardCards()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleDelete = () => {
    removeCard(cardId)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative z-10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        aria-label="Card menu"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[100] mt-1 min-w-[200px] rounded-lg border border-slate-200 bg-white py-1 shadow-xl">
          <button
            onClick={handleDelete}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-left text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs">Delete from Central Dashboard</span>
          </button>
        </div>
      )}
    </div>
  )
}
