import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DollarSign, TrendingUp } from 'lucide-react'
import { SummaryCard } from '@/components/common/SummaryCard'

describe('SummaryCard', () => {
  const defaultProps = {
    icon: DollarSign,
    label: 'Total Revenue',
    value: 'Rp. 12,1 M',
    color: 'blue' as const,
  }

  it('renders the label text', () => {
    render(<SummaryCard {...defaultProps} />)
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
  })

  it('renders the value', () => {
    render(<SummaryCard {...defaultProps} />)
    expect(screen.getByText('Rp. 12,1 M')).toBeInTheDocument()
  })

  it('renders unitLabel when provided', () => {
    render(<SummaryCard {...defaultProps} unitLabel="Per Bulan" />)
    expect(screen.getByText('Per Bulan')).toBeInTheDocument()
  })

  it('does not render unitLabel when omitted', () => {
    render(<SummaryCard {...defaultProps} />)
    expect(screen.queryByText('Per Bulan')).toBeNull()
  })

  it('renders valueNote when provided', () => {
    render(<SummaryCard {...defaultProps} valueNote="*Net of discounts" />)
    expect(screen.getByText('*Net of discounts')).toBeInTheDocument()
  })

  it('renders trend with up direction', () => {
    render(
      <SummaryCard
        {...defaultProps}
        trend={{ value: '5,2%', direction: 'up', caption: 'vs Des 2025' }}
      />,
    )
    expect(screen.getByText(/5,2%/)).toBeInTheDocument()
    expect(screen.getByText(/vs Des 2025/)).toBeInTheDocument()
    expect(screen.getByText(/↗/)).toBeInTheDocument()
  })

  it('renders trend with down direction', () => {
    render(
      <SummaryCard
        {...defaultProps}
        trend={{ value: '3,1%', direction: 'down', caption: 'vs last month' }}
      />,
    )
    expect(screen.getByText(/↘/)).toBeInTheDocument()
  })

  it('does not render trend section when trend is omitted', () => {
    render(<SummaryCard {...defaultProps} />)
    expect(screen.queryByText(/↗|↘/)).toBeNull()
  })

  it('renders all color variants without crashing', () => {
    const colors = ['blue', 'emerald', 'teal', 'amber', 'rose', 'purple'] as const
    colors.forEach((color) => {
      const { unmount } = render(<SummaryCard {...defaultProps} color={color} />)
      expect(screen.getByText('Total Revenue')).toBeInTheDocument()
      unmount()
    })
  })

  it('applies custom className', () => {
    const { container } = render(
      <SummaryCard {...defaultProps} className="my-custom-class" />,
    )
    // The outer Card element should have the custom class
    expect(container.querySelector('.my-custom-class')).toBeInTheDocument()
  })

  it('renders a different icon (TrendingUp)', () => {
    render(<SummaryCard {...defaultProps} icon={TrendingUp} />)
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
  })
})
