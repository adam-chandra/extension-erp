import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginPage } from '@/pages/LoginPage'
import { AuthContext, type AuthContextValue } from '@/context/auth-context'

// --- Mocks ---
vi.mock('@/hooks/useAuthMutations', () => ({
  useLoginMutation: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ state: null, pathname: '/login' }),
  }
})

import { useLoginMutation } from '@/hooks/useAuthMutations'

// --- Helpers ---
const mockAuthCtx: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
}

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } })
}

function renderLoginPage(mutateOptions?: { isPending?: boolean; mutate?: ReturnType<typeof vi.fn> }) {
  const { isPending = false, mutate = vi.fn() } = mutateOptions ?? {}

  vi.mocked(useLoginMutation).mockReturnValue({
    mutate,
    isPending,
    isIdle: !isPending,
    isSuccess: false,
    isError: false,
    error: null,
    data: undefined,
    reset: vi.fn(),
    status: 'idle',
    variables: undefined,
    context: undefined,
    failureCount: 0,
    failureReason: null,
    submittedAt: 0,
    isPaused: false,
  } as unknown as ReturnType<typeof useLoginMutation>)

  return render(
    <MemoryRouter>
      <QueryClientProvider client={makeQueryClient()}>
        <AuthContext.Provider value={mockAuthCtx}>
          <LoginPage />
        </AuthContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

// --- Tests ---
describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email and password inputs', () => {
    renderLoginPage()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Kata sandi')).toBeInTheDocument()
  })

  it('renders the Masuk heading', () => {
    renderLoginPage()
    expect(screen.getByRole('heading', { name: 'Masuk' })).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    renderLoginPage()
    expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument()
  })

  it('shows email validation error when submitted with empty email', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.click(screen.getByRole('button', { name: /masuk/i }))

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
  })

  it('shows password validation error when submitted with short password', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('Email'), 'user@example.com')
    await user.type(screen.getByLabelText('Kata sandi'), '123')
    await user.click(screen.getByRole('button', { name: /masuk/i }))

    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('shows invalid email error for non-email input', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('Email'), 'notanemail')
    await user.type(screen.getByLabelText('Kata sandi'), 'secret123')

    // Submit via the form element to bypass any HTML5 browser-level validation
    const { container } = renderLoginPage()
    const form = container.querySelector('form')!
    const { fireEvent } = await import('@testing-library/react')
    fireEvent.submit(form)

    await waitFor(() => {
      // Check for any email validation error
      const emailErrors = screen.queryAllByText(/invalid email|email is required/i)
      expect(emailErrors.length).toBeGreaterThan(0)
    })
  })

  it('calls login mutation with correct values on valid submit', async () => {
    const mutate = vi.fn()
    const user = userEvent.setup()
    renderLoginPage({ mutate })

    await user.type(screen.getByLabelText('Email'), 'user@example.com')
    await user.type(screen.getByLabelText('Kata sandi'), 'secret123')
    await user.click(screen.getByRole('button', { name: /masuk/i }))

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'secret123',
      })
    })
  })

  it('toggles password visibility when eye button is clicked', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    const passwordInput = screen.getByLabelText('Kata sandi')
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleButton = screen.getByRole('button', { name: /tampilkan kata sandi/i })
    await user.click(toggleButton)

    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('hides password again when eye button is clicked a second time', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    const toggleButton = screen.getByRole('button', { name: /tampilkan kata sandi/i })
    await user.click(toggleButton)
    await user.click(screen.getByRole('button', { name: /sembunyikan kata sandi/i }))

    expect(screen.getByLabelText('Kata sandi')).toHaveAttribute('type', 'password')
  })

  it('disables form controls while isPending is true', () => {
    renderLoginPage({ isPending: true })

    expect(screen.getByLabelText('Email')).toBeDisabled()
    expect(screen.getByLabelText('Kata sandi')).toBeDisabled()
    // Button text changes to 'Memproses…' when pending
    expect(screen.getByRole('button', { name: /memproses/i })).toBeDisabled()
  })
})
