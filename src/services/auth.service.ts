import { apiClient } from '@/lib/axios'
import type { LoginResponse, User, UserCompany, UserModule } from '@/types/auth'
import type { LoginFormValues, RegisterFormValues } from '@/schemas/auth.schema'

interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
}

interface MeApiPayload {
  id: number
  sourceId: number
  login: string
  email?: string
  name: string
  isActive: boolean
  companies?: UserCompany[]
  modules?: UserModule[]
}

function decodeJwtPayload<T = Record<string, unknown>>(token: string): T {
  const payload = token.split('.')[1]
  if (!payload) {
    throw new Error('Invalid JWT token')
  }

  const normalized = payload.replaceAll('-', '+').replaceAll('_', '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const json = decodeURIComponent(
    Array.from(atob(padded))
      .map((char) => `%${char.codePointAt(0)!.toString(16).padStart(2, '0')}`)
      .join(''),
  )

  return JSON.parse(json) as T
}

function payloadToUser(me: MeApiPayload): User {
  return {
    id: String(me.id),
    login: me.login,
    email: me.email ?? '',
    name: me.name,
    companies: me.companies ?? [],
    modules: me.modules ?? [],
  }
}

export const authService = {
  async login(payload: LoginFormValues): Promise<LoginResponse> {
    const { data } = await apiClient.post<ApiEnvelope<{ accessToken: string; refreshToken?: string; user: MeApiPayload }>>(
      '/auth/login',
      payload,
    )

    const { accessToken, refreshToken, user: userPayload } = data.data
    const user = userPayload
      ? payloadToUser(userPayload)
      : (() => {
          const jwtPayload = decodeJwtPayload<{ uid?: string; sub?: string; email?: string; name?: string }>(
            accessToken,
          )
          return {
            id: jwtPayload.uid ?? jwtPayload.sub ?? '',
            email: jwtPayload.email ?? '',
            name: jwtPayload.name ?? '',
          }
        })()

    return { user, accessToken, refreshToken }
  },
  async register(payload: RegisterFormValues): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(
      '/auth/register',
      payload,
    )
    return data
  },
  async me(): Promise<User> {
    const { data } = await apiClient.get<ApiEnvelope<MeApiPayload>>('/auth/me')
    return payloadToUser(data.data)
  },
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },
}
