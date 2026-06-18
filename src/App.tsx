import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthProvider'
import { WorkspaceProvider } from '@/context/WorkspaceContext'
import { DashboardCardsProvider } from '@/context/DashboardCardsContext'
import { AppRoutes } from '@/routes/AppRoutes'
import { queryClient } from '@/lib/queryClient'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <WorkspaceProvider>
            <DashboardCardsProvider>
              <AppRoutes />
            </DashboardCardsProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
