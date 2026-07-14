import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Input } from '../../components/ui/input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('has type="text" by default', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
  })

  it('renders with type="password"', () => {
    const { container } = render(<Input type="password" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('renders with type="email"', () => {
    render(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
  })

  it('renders with placeholder text', () => {
    render(<Input placeholder="Enter your email" />)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('applies extra className', () => {
    render(<Input className="custom-input" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-input')
  })

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName).toBe('INPUT')
  })

  it('spreads additional props (e.g. aria-label)', () => {
    render(<Input aria-label="search" />)
    expect(screen.getByRole('textbox', { name: 'search' })).toBeInTheDocument()
  })
})
