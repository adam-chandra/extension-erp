import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext, type AuthContextValue } from '@/context/auth-context'
import { PublicOnlyRoute } from '@/routes/PublicOnlyRoute'

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

function renderPublicOnly(ctx: AuthContextValue, initialPath = '/login') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthContext.Provider value={ctx}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<div>Login Page</div>} />
          </Route>
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('PublicOnlyRoute', () => {
  it('shows loading state while auth is resolving', () => {
    renderPublicOnly(makeCtx({ isLoading: true }))
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('redirects to /dashboard when user is already authenticated', () => {
    renderPublicOnly(makeCtx({ isAuthenticated: true }))
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
  })

  it('renders the public child route when user is not authenticated', () => {
    renderPublicOnly(makeCtx({ isAuthenticated: false }))
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })
})
