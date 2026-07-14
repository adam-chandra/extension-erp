import { describe, it, expect } from 'vitest'
import { toApiError } from '../lib/axios'
import { AxiosError } from 'axios'

describe('toApiError', () => {
  it('extracts message and status from AxiosError with response', () => {
    const axiosError = new AxiosError('Request failed')
    axiosError.response = {
      status: 422,
      data: { message: 'Validation failed' },
      statusText: 'Unprocessable Entity',
      headers: {},
      config: {} as never,
    }
    const result = toApiError(axiosError)
    expect(result.message).toBe('Validation failed')
    expect(result.status).toBe(422)
    expect(result.data).toEqual({ message: 'Validation failed' })
  })

  it('falls back to error.message when response has no message', () => {
    const axiosError = new AxiosError('Network Error')
    axiosError.response = {
      status: 500,
      data: {},
      statusText: 'Internal Server Error',
      headers: {},
      config: {} as never,
    }
    const result = toApiError(axiosError)
    expect(result.message).toBe('Network Error')
    expect(result.status).toBe(500)
  })

  it('handles AxiosError without a response (network error)', () => {
    const axiosError = new AxiosError('Network Error')
    const result = toApiError(axiosError)
    expect(result.message).toBe('Network Error')
    expect(result.status).toBeUndefined()
  })

  it('handles plain Error', () => {
    const result = toApiError(new Error('Something broke'))
    expect(result.message).toBe('Something broke')
    expect(result.status).toBeUndefined()
  })

  it('handles unknown non-Error value', () => {
    const result = toApiError('unexpected string error')
    expect(result.message).toBe('Unknown error')
  })

  it('handles null', () => {
    const result = toApiError(null)
    expect(result.message).toBe('Unknown error')
  })

  it('uses "Unexpected API error" fallback when AxiosError has no message', () => {
    const axiosError = new AxiosError()
    // No response, no message
    const result = toApiError(axiosError)
    expect(typeof result.message).toBe('string')
    expect(result.message.length).toBeGreaterThan(0)
  })
})
