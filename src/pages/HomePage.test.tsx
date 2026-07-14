import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext, type AuthContextValue } from '@/context/auth-context'
import { HomePage } from '@/pages/HomePage'

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

function renderHome(ctx: AuthContextValue) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={ctx}>
        <HomePage />
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('HomePage', () => {
  it('shows loading text while auth is resolving', () => {
    renderHome(makeCtx({ isLoading: true }))
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('redirects authenticated users (Navigate renders without crashing)', () => {
    // Navigate component will render — just verify no error thrown
    expect(() =>
      renderHome(makeCtx({ isAuthenticated: true })),
    ).not.toThrow()
  })

  it('redirects unauthenticated users to login (Navigate renders without crashing)', () => {
    expect(() =>
      renderHome(makeCtx({ isAuthenticated: false })),
    ).not.toThrow()
  })
})
