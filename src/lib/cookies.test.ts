import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cookieStorage, tokenStorage, COOKIE_KEYS } from '@/lib/cookies'

// Mock js-cookie
vi.mock('js-cookie', () => {
  const store: Record<string, string> = {}
  return {
    default: {
      get: vi.fn((key: string) => store[key]),
      set: vi.fn((key: string, value: string) => { store[key] = value }),
      remove: vi.fn((key: string) => { delete store[key] }),
    },
  }
})

import Cookies from 'js-cookie'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('COOKIE_KEYS', () => {
  it('defines ACCESS_TOKEN and REFRESH_TOKEN keys', () => {
    expect(COOKIE_KEYS.ACCESS_TOKEN).toBe('access_token')
    expect(COOKIE_KEYS.REFRESH_TOKEN).toBe('refresh_token')
  })
})

describe('cookieStorage.get', () => {
  it('calls Cookies.get with the given key', () => {
    cookieStorage.get(COOKIE_KEYS.ACCESS_TOKEN)
    expect(Cookies.get).toHaveBeenCalledWith(COOKIE_KEYS.ACCESS_TOKEN)
  })
})

describe('cookieStorage.set', () => {
  it('calls Cookies.set with key, value and merged options', () => {
    cookieStorage.set(COOKIE_KEYS.ACCESS_TOKEN, 'token-value')
    expect(Cookies.set).toHaveBeenCalledWith(
      COOKIE_KEYS.ACCESS_TOKEN,
      'token-value',
      expect.objectContaining({ path: '/', sameSite: 'lax' }),
    )
  })

  it('merges extra options into defaults', () => {
    cookieStorage.set(COOKIE_KEYS.ACCESS_TOKEN, 'val', { expires: 7 })
    expect(Cookies.set).toHaveBeenCalledWith(
      COOKIE_KEYS.ACCESS_TOKEN,
      'val',
      expect.objectContaining({ expires: 7 }),
    )
  })
})

describe('cookieStorage.remove', () => {
  it('calls Cookies.remove with key and default options', () => {
    cookieStorage.remove(COOKIE_KEYS.ACCESS_TOKEN)
    expect(Cookies.remove).toHaveBeenCalledWith(
      COOKIE_KEYS.ACCESS_TOKEN,
      expect.objectContaining({ path: '/' }),
    )
  })
})

describe('cookieStorage.clearAll', () => {
  it('removes all known cookie keys', () => {
    cookieStorage.clearAll()
    expect(Cookies.remove).toHaveBeenCalledTimes(
      Object.keys(COOKIE_KEYS).length,
    )
  })
})

describe('tokenStorage', () => {
  it('getAccessToken calls cookieStorage.get for access token', () => {
    tokenStorage.getAccessToken()
    expect(Cookies.get).toHaveBeenCalledWith(COOKIE_KEYS.ACCESS_TOKEN)
  })

  it('getRefreshToken calls cookieStorage.get for refresh token', () => {
    tokenStorage.getRefreshToken()
    expect(Cookies.get).toHaveBeenCalledWith(COOKIE_KEYS.REFRESH_TOKEN)
  })

  it('setTokens sets both access and refresh tokens', () => {
    tokenStorage.setTokens('access-123', 'refresh-456')
    expect(Cookies.set).toHaveBeenCalledWith(
      COOKIE_KEYS.ACCESS_TOKEN,
      'access-123',
      expect.any(Object),
    )
    expect(Cookies.set).toHaveBeenCalledWith(
      COOKIE_KEYS.REFRESH_TOKEN,
      'refresh-456',
      expect.any(Object),
    )
  })

  it('setTokens sets only access token when refreshToken is omitted', () => {
    tokenStorage.setTokens('access-only')
    expect(Cookies.set).toHaveBeenCalledTimes(1)
    expect(Cookies.set).toHaveBeenCalledWith(
      COOKIE_KEYS.ACCESS_TOKEN,
      'access-only',
      expect.any(Object),
    )
  })

  it('clearTokens removes access and refresh tokens', () => {
    tokenStorage.clearTokens()
    expect(Cookies.remove).toHaveBeenCalledWith(
      COOKIE_KEYS.ACCESS_TOKEN,
      expect.any(Object),
    )
    expect(Cookies.remove).toHaveBeenCalledWith(
      COOKIE_KEYS.REFRESH_TOKEN,
      expect.any(Object),
    )
  })
})
