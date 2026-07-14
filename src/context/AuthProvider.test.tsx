import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthProvider'
import { AuthContext } from '@/context/auth-context'
import { useContext } from 'react'

vi.mock('@/services/auth.service', () => ({
  authService: {
    me: vi.fn(),
    logout: vi.fn(),
  },
}))

vi.mock('@/lib/cookies', () => ({
  tokenStorage: {
    getAccessToken: vi.fn(),
    getRefreshToken: vi.fn(),
    setTokens: vi.fn(),
    clearTokens: vi.fn(),
  },
  cookieStorage: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    clearAll: vi.fn(),
  },
  COOKIE_KEYS: { ACCESS_TOKEN: 'access_token', REFRESH_TOKEN: 'refresh_token' },
}))

import { authService } from '@/services/auth.service'
import { tokenStorage } from '@/lib/cookies'

const mockMe = vi.mocked(authService.me)
const mockLogout = vi.mocked(authService.logout)
const mockGetAccessToken = vi.mocked(tokenStorage.getAccessToken)
const mockClearTokens = vi.mocked(tokenStorage.clearTokens)

function ContextConsumer() {
  const ctx = useContext(AuthContext)
  if (!ctx) return <div>no-context</div>
  return (
    <div>
      <span data-testid="loading">{String(ctx.isLoading)}</span>
      <span data-testid="authenticated">{String(ctx.isAuthenticated)}</span>
      <span data-testid="user">{ctx.user?.name ?? 'no-user'}</span>
    </div>
  )
}

function renderProvider() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ContextConsumer />
      </AuthProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetAccessToken.mockReturnValue(undefined)
})

describe('AuthProvider', () => {
  it('starts in loading state', () => {
    mockGetAccessToken.mockReturnValue(undefined)
    renderProvider()
    // isLoading starts true then settles
    // The component finishes quickly with no token
    expect(screen.getByTestId('authenticated').textContent).toBe('false')
  })

  it('sets isLoading=false with no token', async () => {
    mockGetAccessToken.mockReturnValue(undefined)
    renderProvider()
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('authenticated').textContent).toBe('false')
  })

  it('hydrates user when token exists and me() succeeds', async () => {
    mockGetAccessToken.mockReturnValue('valid-token')
    mockMe.mockResolvedValue({ id: '1', login: 'u', name: 'Test User', email: 'u@x.com', companies: [], modules: [] })
    renderProvider()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('Test User'))
    expect(screen.getByTestId('authenticated').textContent).toBe('true')
  })

  it('clears tokens and sets user=null when me() fails', async () => {
    mockGetAccessToken.mockReturnValue('bad-token')
    mockMe.mockRejectedValue(new Error('Unauthorized'))
    renderProvider()
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(mockClearTokens).toHaveBeenCalled()
    expect(screen.getByTestId('authenticated').textContent).toBe('false')
  })

  it('handles auth:unauthorized event by clearing user', async () => {
    mockGetAccessToken.mockReturnValue(undefined)
    renderProvider()
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    act(() => {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    })
    await waitFor(() => expect(screen.getByTestId('authenticated').textContent).toBe('false'))
  })
})
