import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('renders as a button element by default', () => {
    render(<Button>Submit</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('applies extra className', () => {
    render(<Button className="custom-class">Styled</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('passes through onClick handler', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    screen.getByRole('button').click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders with variant="outline"', () => {
    render(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with variant="destructive"', () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with variant="ghost"', () => {
    render(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with variant="link"', () => {
    render(<Button variant="link">Link</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with size="sm"', () => {
    render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with size="lg"', () => {
    render(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with type="submit"', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})
