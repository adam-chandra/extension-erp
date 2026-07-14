import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Building } from 'lucide-react'
import { ModuleCard } from '@/components/common/ModuleCard'

describe('ModuleCard', () => {
  const defaultProps = {
    title: 'Invoice Tracking',
    subtitle: 'Halaman Invoice',
    description: 'Konten siap untuk monitoring invoice.',
    icon: Building,
    iconWrapperClassName: 'bg-emerald-100 text-emerald-700',
    iconClassName: 'h-5 w-5',
  }

  it('renders title', () => {
    render(<ModuleCard {...defaultProps} />)
    expect(screen.getByText('Invoice Tracking')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<ModuleCard {...defaultProps} />)
    expect(screen.getByText('Halaman Invoice')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<ModuleCard {...defaultProps} />)
    expect(screen.getByText('Konten siap untuk monitoring invoice.')).toBeInTheDocument()
  })

  it('applies icon wrapper class', () => {
    const { container } = render(<ModuleCard {...defaultProps} />)
    expect(container.querySelector('.bg-emerald-100')).toBeInTheDocument()
  })
})
