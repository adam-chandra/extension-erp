import { useMutation, useQuery, type UseMutationOptions } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { useAuth } from '@/hooks/useAuth'
import type { LoginResponse } from '@/types/auth'
import type { LoginFormValues, RegisterFormValues } from '@/schemas/auth.schema'

export const authKeys = {
  me: ['auth', 'me'] as const,
}

export function useMe() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authService.me,
    enabled: isAuthenticated,
  })
}

export function useLoginMutation(
  options?: UseMutationOptions<LoginResponse, unknown, LoginFormValues>,
) {
  const { login } = useAuth()
  return useMutation({
    mutationFn: authService.login,
    ...options,
    onSuccess: (data, ...rest) => {
      login(data.accessToken, data.user, data.refreshToken)
      ;(options?.onSuccess as ((d: LoginResponse, ...r: unknown[]) => void) | undefined)?.(data, ...rest)
    },
  })
}

export function useRegisterMutation(
  options?: UseMutationOptions<LoginResponse, unknown, RegisterFormValues>,
) {
  const { login } = useAuth()
  return useMutation({
    mutationFn: authService.register,
    ...options,
    onSuccess: (data, ...rest) => {
      login(data.accessToken, data.user, data.refreshToken)
      ;(options?.onSuccess as ((d: LoginResponse, ...r: unknown[]) => void) | undefined)?.(data, ...rest)
    },
  })
}
