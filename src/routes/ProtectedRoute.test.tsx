import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext, type AuthContextValue } from '@/context/auth-context'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

function makeCtx(partial: Partial<AuthContextValue>): AuthContextValue {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    ...partial,
  }
}

function renderProtected(ctx: AuthContextValue, initialPath = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthContext.Provider value={ctx}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('shows loading state while auth is resolving', () => {
    renderProtected(makeCtx({ isLoading: true }))
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('redirects to /login when user is not authenticated', () => {
    renderProtected(makeCtx({ isAuthenticated: false }))
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renders the child route when user is authenticated', () => {
    renderProtected(makeCtx({ isAuthenticated: true, user: { id: 1, name: 'Test', login: 'test', email: 'test@example.com', isActive: true } as never }))
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
  })
})
