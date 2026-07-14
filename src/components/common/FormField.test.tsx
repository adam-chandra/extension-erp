import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormField } from '@/components/common/FormField'

describe('FormField', () => {
  it('renders label text', () => {
    render(
      <FormField label="Email Address" htmlFor="email">
        <input id="email" />
      </FormField>,
    )
    expect(screen.getByText('Email Address')).toBeInTheDocument()
  })

  it('renders child element', () => {
    render(
      <FormField label="Password" htmlFor="password">
        <input id="password" type="password" data-testid="pw-input" />
      </FormField>,
    )
    expect(screen.getByTestId('pw-input')).toBeInTheDocument()
  })

  it('associates label with htmlFor', () => {
    render(
      <FormField label="Username" htmlFor="username">
        <input id="username" />
      </FormField>,
    )
    const label = screen.getByText('Username')
    expect(label).toHaveAttribute('for', 'username')
  })

  it('does not render error paragraph when error is undefined', () => {
    const { container } = render(
      <FormField label="Name" htmlFor="name">
        <input id="name" />
      </FormField>,
    )
    expect(container.querySelector('p')).toBeNull()
  })

  it('renders error message when error prop is provided', () => {
    render(
      <FormField label="Email" htmlFor="email" error="Invalid email address">
        <input id="email" />
      </FormField>,
    )
    expect(screen.getByText('Invalid email address')).toBeInTheDocument()
  })

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <FormField label="Test" htmlFor="test" className="custom-wrapper">
        <input id="test" />
      </FormField>,
    )
    expect(container.firstChild).toHaveClass('custom-wrapper')
  })
})
