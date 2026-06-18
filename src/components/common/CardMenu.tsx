import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Copy, Check } from 'lucide-react'
import { useDashboardCards } from '@/context/DashboardCardsContext'

interface CardMenuProps {
  cardId: string
  cardType: 'tile' | 'verticalBar' | 'pie' | 'multiLine' | 'singleLine' | 'horizontalBar'
  cardData: any
}

export function CardMenu({ cardId, cardType, cardData }: CardMenuProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { addCard, hasCard } = useDashboardCards()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleCopy = () => {
    addCard({
      id: cardId,
      type: cardType,
      data: cardData,
      module: 'central-dashboard', // Always add to central-dashboard module
    })
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setOpen(false)
    }, 1500)
  }

  const isAlreadyCopied = hasCard(cardId)

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
        <div className="absolute right-0 top-full z-[100] mt-1 min-w-[200px] max-w-[240px] rounded-lg border border-slate-200 bg-white py-1 shadow-xl">
          <button
            onClick={handleCopy}
            disabled={copied || isAlreadyCopied}
            className={`flex w-full items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${
              copied || isAlreadyCopied
                ? 'cursor-not-allowed text-slate-400'
                : 'text-slate-700 hover:bg-primary/5'
            }`}
          >
            {copied || isAlreadyCopied ? (
              <Check className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
            ) : (
              <Copy className="h-3.5 w-3.5 flex-shrink-0" />
            )}
            <span className="text-xs leading-tight">
              {copied
                ? 'Copied!'
                : isAlreadyCopied
                ? 'Already in Central Dashboard'
                : 'Copy to Central Dashboard'}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
