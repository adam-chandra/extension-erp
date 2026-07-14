import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NotFoundPage } from '@/pages/NotFoundPage'

describe('NotFoundPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    )

  it('renders the 404 heading', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
  })

  it('renders the "Page not found" text', () => {
    renderPage()
    expect(screen.getByText('Page not found.')).toBeInTheDocument()
  })

  it('renders a link to go home', () => {
    renderPage()
    const link = screen.getByRole('link', { name: 'Go home' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })
})
