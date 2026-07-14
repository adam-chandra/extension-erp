import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ListViewCard } from '@/components/common/ListViewCard'
import { DashboardCardsProvider } from '@/context/DashboardCardsContext'

function Provider({ children }: { children: React.ReactNode }) {
  return <DashboardCardsProvider>{children}</DashboardCardsProvider>
}

const sampleData = [
  { no: 1, name: 'Product A', amount: 5000000, date: '2025-01-15' },
  { no: 2, name: 'Product B', amount: 3000000, date: '2025-01-16' },
  { no: 3, name: 'Product C', amount: 1500000, date: '2025-01-17' },
]

describe('ListViewCard', () => {
  it('renders title', () => {
    render(<Provider><ListViewCard title="Retur Penjualan" data={sampleData} /></Provider>)
    expect(screen.getByText('Retur Penjualan')).toBeInTheDocument()
  })

  it('auto-generates column headers from data keys', () => {
    render(<Provider><ListViewCard title="T" data={sampleData} /></Provider>)
    expect(screen.getByText('No')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('renders row values', () => {
    render(<Provider><ListViewCard title="T" data={sampleData} /></Provider>)
    expect(screen.getByText('Product A')).toBeInTheDocument()
    expect(screen.getByText('Product B')).toBeInTheDocument()
  })

  it('renders with custom columns', () => {
    const columns = [
      { key: 'no', label: '#' },
      { key: 'name', label: 'Nama Produk' },
      { key: 'amount', label: 'Jumlah', render: (v: number) => `Rp ${v.toLocaleString('id-ID')}` },
    ]
    render(<Provider><ListViewCard title="T" data={sampleData} columns={columns} /></Provider>)
    expect(screen.getByText('Nama Produk')).toBeInTheDocument()
    expect(screen.getByText('Jumlah')).toBeInTheDocument()
    expect(screen.getByText('Rp 5.000.000')).toBeInTheDocument()
  })

  it('renders with cardId and module (shows menu)', () => {
    render(<Provider><ListViewCard title="T" data={sampleData} cardId="list-1" module="accounting" /></Provider>)
    expect(screen.getByLabelText('Card menu')).toBeInTheDocument()
  })

  it('renders with customMenu', () => {
    render(<Provider><ListViewCard title="T" data={sampleData} customMenu={<button>Action</button>} /></Provider>)
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('renders empty state when data is empty', () => {
    render(<Provider><ListViewCard title="Empty" data={[]} /></Provider>)
    expect(screen.getByText('Empty')).toBeInTheDocument()
  })

  it('renders pagination when pagination=true and data exceeds itemsPerPage', async () => {
    const manyRows = Array.from({ length: 12 }, (_, i) => ({ no: i + 1, name: `Item ${i + 1}` }))
    const user = userEvent.setup()
    render(<Provider><ListViewCard title="T" data={manyRows} pagination itemsPerPage={5} /></Provider>)
    // Should show 5 items on page 1
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.queryByText('Item 6')).toBeNull()
    // Click next page
    const nextBtn = screen.getByRole('button', { name: /next/i })
    await user.click(nextBtn)
    expect(screen.getByText('Item 6')).toBeInTheDocument()
  })

  it('renders striped table', () => {
    const { container } = render(<Provider><ListViewCard title="T" data={sampleData} striped /></Provider>)
    expect(container.querySelector('table')).toBeInTheDocument()
  })

  it('renders without striped', () => {
    const { container } = render(<Provider><ListViewCard title="T" data={sampleData} striped={false} /></Provider>)
    expect(container.querySelector('table')).toBeInTheDocument()
  })

  it('renders with autoGenerateColumns=false and no columns defined', () => {
    render(<Provider><ListViewCard title="T" data={sampleData} autoGenerateColumns={false} /></Provider>)
    expect(screen.getByText('T')).toBeInTheDocument()
  })
})
