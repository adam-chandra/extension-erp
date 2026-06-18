import { useEffect, useRef, useState } from 'react'
import {
  LogOut,
  Maximize2,
  Menu,
  Minimize2,
  Settings,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WorkspaceHeaderProps {
  companyBadge: string
  moduleBadge: string
  isFullscreen: boolean
  isSidebarCollapsed: boolean
  userName: string
  userEmail: string
  onOpenMobileSidebar: () => void
  onToggleSidebar: () => void
  onToggleFullscreen: () => void
  onLogout: () => void
}

export function WorkspaceHeader({
  companyBadge,
  moduleBadge,
  isFullscreen,
  isSidebarCollapsed,
  userName,
  userEmail,
  onOpenMobileSidebar,
  onToggleSidebar,
  onToggleFullscreen,
  onLogout,
}: WorkspaceHeaderProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!profileMenuRef.current) return
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsProfileMenuOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onEscape)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onEscape)
    }
  }, [])

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar size"
          title={isSidebarCollapsed ? 'Expand menu' : 'Minimize menu'}
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold text-slate-800 sm:text-lg">
            Workspace Dashboard
          </h1>
          <div className="mt-1 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#ed8c2d]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#9a4f0e]">
              {companyBadge}
            </span>
            <span className="rounded-full bg-[#ed8c2d]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#9a4f0e]">
              {moduleBadge}
            </span>
          </div>
        </div>
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <Button
          variant="outline"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={onToggleFullscreen}
          aria-label="Toggle fullscreen"
          title={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>

        <div ref={profileMenuRef} className="relative hidden lg:block">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700 transition hover:border-[#ed8c2d] hover:text-[#ed8c2d]"
            aria-label="Open profile menu"
            aria-expanded={isProfileMenuOpen}
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            title={userName}
          >
            {(userName ?? userEmail ?? 'U').charAt(0).toUpperCase()}
          </button>

          <div
            className={[
              'absolute right-0 top-11 z-30 w-52 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg transition',
              isProfileMenuOpen
                ? 'pointer-events-auto translate-y-0 opacity-100'
                : 'pointer-events-none -translate-y-1 opacity-0',
            ].join(' ')}
          >
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
            >
              <User className="h-4 w-4" />
              My Profile
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
            >
              <Settings className="h-4 w-4" />
              Account Settings
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
