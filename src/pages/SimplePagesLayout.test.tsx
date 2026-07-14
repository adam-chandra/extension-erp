import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/components/common/withWorkspaceLayout', () => ({
  withWorkspaceLayout: (Component: React.ComponentType<any>) =>
    function WrappedForTest(props: any) {
      return <Component {...props} showCentralDashboard={false} showProcurement={true} showAccounting={true} showHRIS={true} showAsset={true} />
    },
}))

describe('InvoicePage', () => {
  it('renders Invoice Tracking title', async () => {
    const { InvoicePage } = await import('@/pages/InvoicePage')
    render(<MemoryRouter><InvoicePage /></MemoryRouter>)
    expect(screen.getByText('Invoice Tracking')).toBeInTheDocument()
  })

  it('renders subtitle', async () => {
    const { InvoicePage } = await import('@/pages/InvoicePage')
    render(<MemoryRouter><InvoicePage /></MemoryRouter>)
    expect(screen.getByText('Halaman Invoice')).toBeInTheDocument()
  })
})

describe('LabelPage', () => {
  it('renders Label Asset heading', async () => {
    const { LabelPage } = await import('@/pages/LabelPage')
    render(<MemoryRouter><LabelPage /></MemoryRouter>)
    expect(screen.getByText('Label Asset')).toBeInTheDocument()
  })
})

describe('PurchasePage', () => {
  it('renders Purchase Order title', async () => {
    const { PurchasePage } = await import('@/pages/PurchasePage')
    render(<MemoryRouter><PurchasePage /></MemoryRouter>)
    expect(screen.getByText('Purchase Order')).toBeInTheDocument()
  })
})
