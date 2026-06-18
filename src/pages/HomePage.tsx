import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/config/routes'
import { useAuth } from '@/hooks/useAuth'

export function HomePage() {
  const { isAuthenticated } = useAuth()
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-semibold">Extension ERP</h1>
      <p className="mt-2 text-(--color-muted-foreground)">
        React + Vite + Tailwind + shadcn boilerplate.
      </p>
      <div className="mt-6 flex gap-3">
        {isAuthenticated ? (
          // [PHASE1] points to accounting dashboard; central dashboard is hidden
          <Link to={ROUTES.DASHBOARD_ACCOUNTING}>
            <Button>Go to dashboard</Button>
          </Link>
        ) : (
          <Link to={ROUTES.LOGIN}>
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </main>
  )
}
