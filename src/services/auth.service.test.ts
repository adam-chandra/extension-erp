import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '@/services/auth.service'

vi.mock('@/lib/axios', () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}))

import { apiClient } from '@/lib/axios'

const mockApiGet = vi.mocked(apiClient.get)
const mockApiPost = vi.mocked(apiClient.post)

function envelope<T>(data: T) {
  return { data: { code: 200, message: 'ok', data } }
}

// Minimal valid JWT with base64-encoded payload
function makeJwt(payload: Record<string, unknown>) {
  const p = btoa(JSON.stringify(payload))
  return `header.${p}.sig`
}

beforeEach(() => vi.clearAllMocks())

describe('authService.login', () => {
  it('returns LoginResponse with user from userPayload when present', async () => {
    const userPayload = { id: 1, sourceId: 10, login: 'ada', name: 'Ada', email: 'a@b.com', isActive: true }
    mockApiPost.mockResolvedValue(envelope({ accessToken: 'at', refreshToken: 'rt', user: userPayload }))

    const result = await authService.login({ email: 'ada', password: 'pass' })

    expect(result.accessToken).toBe('at')
    expect(result.refreshToken).toBe('rt')
    expect(result.user.name).toBe('Ada')
    expect(result.user.login).toBe('ada')
  })

  it('decodes user from JWT payload when userPayload is null', async () => {
    const jwtPayload = { uid: '42', email: 'jwt@example.com', name: 'JWT User' }
    const token = makeJwt(jwtPayload)
    mockApiPost.mockResolvedValue(envelope({ accessToken: token, refreshToken: undefined, user: null }))

    const result = await authService.login({ email: 'jwt@example.com', password: 'pass' })

    expect(result.user.id).toBe('42')
    expect(result.user.email).toBe('jwt@example.com')
  })

  it('falls back to sub when uid is absent in JWT', async () => {
    const jwtPayload = { sub: '99', email: 'sub@example.com' }
    const token = makeJwt(jwtPayload)
    mockApiPost.mockResolvedValue(envelope({ accessToken: token, user: null }))

    const result = await authService.login({ email: 'sub@example.com', password: 'pass' })
    expect(result.user.id).toBe('99')
  })

  it('propagates API errors', async () => {
    mockApiPost.mockRejectedValue(new Error('Network error'))
    await expect(authService.login({ email: 'a', password: 'b' })).rejects.toThrow()
  })
})

describe('authService.register', () => {
  it('returns LoginResponse from API', async () => {
    const loginResp = { accessToken: 'tok', user: { id: '1', login: 'u', name: 'U', email: '' } }
    mockApiPost.mockResolvedValue({ data: loginResp })

    const result = await authService.register({ name: 'U', email: 'u@x.com', password: 'abc123', confirmPassword: 'abc123' })
    expect(result.accessToken).toBe('tok')
  })
})

describe('authService.me', () => {
  it('returns User from API envelope', async () => {
    const me = { id: 5, sourceId: 50, login: 'me', name: 'Me User', email: 'me@x.com', isActive: true }
    mockApiGet.mockResolvedValue(envelope(me))

    const user = await authService.me()
    expect(user.name).toBe('Me User')
    expect(user.email).toBe('me@x.com')
  })

  it('handles missing email in me response', async () => {
    const me = { id: 5, sourceId: 50, login: 'me', name: 'No Email', isActive: true }
    mockApiGet.mockResolvedValue(envelope(me))

    const user = await authService.me()
    expect(user.email).toBe('')
  })
})

describe('authService.logout', () => {
  it('calls POST /auth/logout', async () => {
    mockApiPost.mockResolvedValue({})
    await authService.logout()
    expect(mockApiPost).toHaveBeenCalledWith('/auth/logout')
  })
})
