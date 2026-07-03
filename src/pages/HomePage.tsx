import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { useAuth } from '@/hooks/useAuth'

export function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <div className="p-8 text-sm">Loading…</div>
  }
  
  // Redirect to dashboard if authenticated, otherwise to login
  return <Navigate to={isAuthenticated ? ROUTES.DASHBOARD_ACCOUNTING : ROUTES.LOGIN} replace />
}