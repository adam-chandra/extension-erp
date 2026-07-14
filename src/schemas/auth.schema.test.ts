import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '@/schemas/auth.schema'

describe('loginSchema', () => {
  it('passes with valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'secret123' })
    expect(result.success).toBe(true)
  })

  it('fails when email is empty', () => {
    const result = loginSchema.safeParse({ email: '', password: 'secret123' })
    expect(result.success).toBe(false)
  })

  it('fails when email is not a valid email address', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret123' })
    expect(result.success).toBe(false)
  })

  it('fails when password is shorter than 6 characters', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '123' })
    expect(result.success).toBe(false)
  })

  it('fails when password is empty', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '' })
    expect(result.success).toBe(false)
  })

  it('fails when both fields are missing', () => {
    const result = loginSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('passes with minimum valid password length (6 chars)', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: '123456' })
    expect(result.success).toBe(true)
  })
})

describe('registerSchema', () => {
  const valid = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'secret123',
    confirmPassword: 'secret123',
  }

  it('passes with all valid fields', () => {
    const result = registerSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('fails when name is too short (< 2 chars)', () => {
    const result = registerSchema.safeParse({ ...valid, name: 'J' })
    expect(result.success).toBe(false)
  })

  it('fails when email is invalid', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'not-email' })
    expect(result.success).toBe(false)
  })

  it('fails when password is too short', () => {
    const result = registerSchema.safeParse({ ...valid, password: '12345', confirmPassword: '12345' })
    expect(result.success).toBe(false)
  })

  it("fails when confirmPassword doesn't match password", () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: 'different' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'))
      expect(paths).toContain('confirmPassword')
    }
  })

  it('fails when all fields are missing', () => {
    const result = registerSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
