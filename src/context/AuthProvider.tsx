import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { tokenStorage } from '@/lib/cookies'
import { authService } from '@/services/auth.service'
import { ROUTES } from '@/config/routes'
import type { User } from '@/types/auth'
import { AuthContext, type AuthContextValue } from './auth-context'

interface Props {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Hydrate user from API if a token exists
  useEffect(() => {
    let cancelled = false
    const token = tokenStorage.getAccessToken()
    if (!token) {
      setIsLoading(false)
      return
    }
    authService
      .me()
      .then((u) => !cancelled && setUser(u))
      .catch(() => {
        tokenStorage.clearTokens()
        if (!cancelled) setUser(null)
      })
      .finally(() => !cancelled && setIsLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  // React to 401s emitted by the axios interceptor
  useEffect(() => {
    const handler = () => {
      setUser(null)
      navigate(ROUTES.LOGIN, { replace: true })
    }
    window.addEventListener('auth:unauthorized', handler)
    return () => window.removeEventListener('auth:unauthorized', handler)
  }, [navigate])

  const login = useCallback<AuthContextValue['login']>(
    (accessToken, nextUser, refreshToken) => {
      tokenStorage.setTokens(accessToken, refreshToken)
      setUser(nextUser)
    },
    [],
  )

  const logout = useCallback<AuthContextValue['logout']>(async () => {
    try {
      await authService.logout()
    } catch {
      // ignore — we still clear locally
    } finally {
      tokenStorage.clearTokens()
      setUser(null)
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }, [navigate])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
