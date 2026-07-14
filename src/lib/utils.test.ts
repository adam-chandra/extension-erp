import { describe, it, expect } from 'vitest'
import { cn, formatNumber, formatCurrency, formatCurrencyIDR } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'skip', 'keep')).toBe('base keep')
  })

  it('deduplicates tailwind conflicts (twMerge)', () => {
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4')
  })

  it('returns empty string for no input', () => {
    expect(cn()).toBe('')
  })

  it('handles undefined and null gracefully', () => {
    expect(cn(undefined, null as unknown as string, 'valid')).toBe('valid')
  })
})

describe('formatNumber', () => {
  it('formats thousands with Indonesian dot separator', () => {
    expect(formatNumber(12458)).toBe('12.458')
  })

  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('formats large numbers', () => {
    expect(formatNumber(1_000_000)).toBe('1.000.000')
  })

  it('formats numbers below 1000 without separator', () => {
    expect(formatNumber(999)).toBe('999')
  })
})

describe('formatCurrency', () => {
  it('formats billions as Miliar (M)', () => {
    const result = formatCurrency(12_000_000_000)
    expect(result).toContain('M')
    expect(result).toContain('Rp.')
  })

  it('formats millions as Juta (Jt)', () => {
    const result = formatCurrency(2_200_000)
    expect(result).toContain('Jt')
    expect(result).toContain('Rp.')
  })

  it('formats values below 1 million as full number', () => {
    const result = formatCurrency(850_000)
    expect(result).toContain('Rp.')
    expect(result).not.toContain('M')
    expect(result).not.toContain('Jt')
  })

  it('handles negative billions correctly', () => {
    const result = formatCurrency(-5_000_000_000)
    expect(result).toContain('M')
  })

  it('handles negative millions correctly', () => {
    const result = formatCurrency(-1_500_000)
    expect(result).toContain('Jt')
  })

  it('formats zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('Rp.')
  })

  it('handles exactly 1 billion boundary', () => {
    const result = formatCurrency(1_000_000_000)
    expect(result).toContain('M')
  })

  it('handles exactly 1 million boundary', () => {
    const result = formatCurrency(1_000_000)
    expect(result).toContain('Jt')
  })
})

describe('formatCurrencyIDR', () => {
  it('formats with Rp. prefix and no abbreviation', () => {
    const result = formatCurrencyIDR(48_750_000_000)
    expect(result).toMatch(/^Rp\./)
    expect(result).not.toContain('M')
    expect(result).not.toContain('Jt')
  })

  it('formats zero', () => {
    expect(formatCurrencyIDR(0)).toContain('Rp.')
  })
})
