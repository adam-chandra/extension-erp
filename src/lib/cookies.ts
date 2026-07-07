import Cookies from 'js-cookie'

export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const

export type CookieKey = (typeof COOKIE_KEYS)[keyof typeof COOKIE_KEYS]

const DEFAULT_OPTIONS: Cookies.CookieAttributes = {
  secure: import.meta.env.PROD,
  sameSite: 'lax',
  path: '/',
}

export const cookieStorage = {
  get(key: CookieKey): string | undefined {
    return Cookies.get(key)
  },
  set(key: CookieKey, value: string, options?: Cookies.CookieAttributes) {
    Cookies.set(key, value, { ...DEFAULT_OPTIONS, ...options })
  },
  remove(key: CookieKey, options?: Cookies.CookieAttributes) {
    Cookies.remove(key, { ...DEFAULT_OPTIONS, ...options })
  },
  clearAll() {
    Object.values(COOKIE_KEYS).forEach((k) =>
      Cookies.remove(k, DEFAULT_OPTIONS),
    )
  },
}

export const tokenStorage = {
  getAccessToken: () => cookieStorage.get(COOKIE_KEYS.ACCESS_TOKEN),
  getRefreshToken: () => cookieStorage.get(COOKIE_KEYS.REFRESH_TOKEN),
  setTokens: (accessToken: string, refreshToken?: string) => {
    cookieStorage.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
      expires: 30, // 30 days
    })
    if (refreshToken) {
      cookieStorage.set(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
        expires: 30, // 30 days
      })
    }
  },
  clearTokens: () => {
    cookieStorage.remove(COOKIE_KEYS.ACCESS_TOKEN)
    cookieStorage.remove(COOKIE_KEYS.REFRESH_TOKEN)
  },
}
