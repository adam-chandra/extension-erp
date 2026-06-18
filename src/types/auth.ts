export interface UserCompany {
  id: number
  sourceId: number
  name: string
  isDefault: boolean
}

export interface UserModule {
  id: number
  sourceId: number
  name: string
}

export interface User {
  id: string
  email: string
  name: string
  login?: string
  companies?: UserCompany[]
  modules?: UserModule[]
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken?: string
}
