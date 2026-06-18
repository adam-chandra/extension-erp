import { createContext, useState, useContext, type ReactNode } from 'react'

export interface DashboardCard {
  id: string
  type: 'tile' | 'verticalBar' | 'pie' | 'multiLine' | 'singleLine' | 'horizontalBar'
  data: any
  module: 'central-dashboard' | 'procurement' | 'accounting' | 'hris'
}

interface DashboardCardsContextType {
  cards: DashboardCard[]
  addCard: (card: DashboardCard) => void
  removeCard: (id: string) => void
  hasCard: (id: string) => boolean
}

const DashboardCardsContext = createContext<DashboardCardsContextType | undefined>(undefined)

export function DashboardCardsProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<DashboardCard[]>([])

  const addCard = (card: DashboardCard) => {
    setCards((prev) => {
      // Prevent duplicates
      if (prev.some((c) => c.id === card.id)) {
        return prev
      }
      return [...prev, card]
    })
  }

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
  }

  const hasCard = (id: string) => {
    return cards.some((c) => c.id === id)
  }

  return (
    <DashboardCardsContext.Provider value={{ cards, addCard, removeCard, hasCard }}>
      {children}
    </DashboardCardsContext.Provider>
  )
}

export function useDashboardCards() {
  const context = useContext(DashboardCardsContext)
  if (!context) {
    throw new Error('useDashboardCards must be used within DashboardCardsProvider')
  }
  return context
}
