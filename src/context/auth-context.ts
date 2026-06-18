import { createContext } from 'react'
import type { User } from '@/types/auth'

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (accessToken: string, user: User, refreshToken?: string) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)
