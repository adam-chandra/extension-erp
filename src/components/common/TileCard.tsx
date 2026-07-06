import type { LucideIcon } from 'lucide-react'
import { CardMenu } from './CardMenu'

interface TileCardProps {
  title: string
  value: string
  unit?: string
  remarks?: string
  icon: LucideIcon
  iconBgColor?: string
  iconColor?: string
  cardId?: string
  module?: 'central-dashboard' | 'procurement' | 'accounting' | 'hris'
  customMenu?: React.ReactNode
  onClick?: () => void
}

export function TileCard({
  title,
  value,
  unit,
  remarks,
  icon: Icon,
  iconBgColor = 'bg-green-100',
  iconColor = 'text-green-600',
  cardId,
  module,
  customMenu,
  onClick,
}: TileCardProps) {
  const showMenu = customMenu || (cardId && module)

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }

  const content = (
    <>
      {/* Header with title and menu */}
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-2">
        <span className="flex-1 min-w-0 text-sm font-medium text-gray-500 line-clamp-2">{title}</span>
        {showMenu && (
          <div
            className="flex-shrink-0 -mt-1"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            {customMenu || (
              <CardMenu
                cardId={cardId!}
                cardType="tile"
                cardData={{ title, value, icon: Icon.name, iconBgColor, iconColor }}
              />
            )}
          </div>
        )}
      </div>

      {/* Content with icon and value */}
      <div className="flex items-center gap-4 px-5 pb-3">
        {/* Icon */}
        <div className={`flex-shrink-0 flex items-center justify-center rounded-xl p-3 ${iconBgColor}`}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>

        {/* Value + Unit */}
        <div className="flex-1 min-w-0">
          <span className="block text-xl font-bold text-gray-900 leading-tight break-words">{value}</span>
          {unit && (
            <span className="block text-xs font-medium text-gray-400 mt-0.5">{unit}</span>
          )}
        </div>
      </div>

      {/* Remarks footer */}
      {remarks && (
        <div className="border-t border-gray-100 px-5 py-2">
          <p className="text-xs text-gray-400 italic leading-snug">{remarks}</p>
        </div>
      )}
    </>
  )

  if (onClick) {
    return (
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        className="overflow-hidden rounded-2xl bg-white shadow-md w-full cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {content}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md w-full">
      {content}
    </div>
  )
}