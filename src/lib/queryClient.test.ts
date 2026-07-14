import { describe, it, expect } from 'vitest'
import { queryClient } from '@/lib/queryClient'
import { QueryClient } from '@tanstack/react-query'

describe('queryClient', () => {
  it('is a QueryClient instance', () => {
    expect(queryClient).toBeInstanceOf(QueryClient)
  })

  it('has retry=1 for queries', () => {
    const opts = queryClient.getDefaultOptions()
    expect(opts.queries?.retry).toBe(1)
  })

  it('has retry=0 for mutations', () => {
    const opts = queryClient.getDefaultOptions()
    expect(opts.mutations?.retry).toBe(0)
  })

  it('has refetchOnWindowFocus=false', () => {
    const opts = queryClient.getDefaultOptions()
    expect(opts.queries?.refetchOnWindowFocus).toBe(false)
  })
})
