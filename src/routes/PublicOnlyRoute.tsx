import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/config/routes'

export function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="p-8 text-sm">Loading…</div>
  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />
  return <Outlet />
}
