import { createContext, useState, useContext, useEffect, type ReactNode } from 'react'
import type { ModuleFilter } from '@/types/dashboard'

interface WorkspaceContextType {
  selectedCompany: string
  selectedModule: ModuleFilter
  setSelectedCompany: (company: string) => void
  setSelectedModule: (module: ModuleFilter) => void
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [selectedCompany, setSelectedCompanyState] = useState<string>(() => {
    return localStorage.getItem('selectedCompany') || ''
  })
  
  const [selectedModule, setSelectedModuleState] = useState<ModuleFilter>(() => {
    // [PHASE1] Only allow accounting + hris. Normalize stale values.
    const stored = localStorage.getItem('selectedModule') as ModuleFilter | null
    if (stored === 'accounting' || stored === 'hris') return stored
    return 'accounting'
    // return (localStorage.getItem('selectedModule') as ModuleFilter) || 'all'
  })

  const setSelectedCompany = (company: string) => {
    setSelectedCompanyState(company)
    localStorage.setItem('selectedCompany', company)
  }

  const setSelectedModule = (module: ModuleFilter) => {
    setSelectedModuleState(module)
    localStorage.setItem('selectedModule', module)
  }

  useEffect(() => {
    // Sync with localStorage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCompany' && e.newValue) {
        setSelectedCompanyState(e.newValue)
      }
      if (e.key === 'selectedModule' && e.newValue) {
        setSelectedModuleState(e.newValue as ModuleFilter)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <WorkspaceContext.Provider
      value={{
        selectedCompany,
        selectedModule,
        setSelectedCompany,
        setSelectedModule,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider')
  }
  return context
}
