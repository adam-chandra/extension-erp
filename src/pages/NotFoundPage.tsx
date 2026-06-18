import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-md p-12 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-(--color-muted-foreground)">Page not found.</p>
      <Link to={ROUTES.HOME} className="mt-4 inline-block underline">
        Go home
      </Link>
    </main>
  )
}
