import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

describe('Card', () => {
  it('renders children inside a div', () => {
    render(<Card>Card body</Card>)
    expect(screen.getByText('Card body')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="extra-class">Content</Card>)
    expect(container.firstChild).toHaveClass('extra-class')
  })

  it('has data-slot="card"', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument()
  })
})

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>Header content</CardHeader>)
    expect(screen.getByText('Header content')).toBeInTheDocument()
  })

  it('has data-slot="card-header"', () => {
    const { container } = render(<CardHeader>H</CardHeader>)
    expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument()
  })
})

describe('CardTitle', () => {
  it('renders title text', () => {
    render(<CardTitle>My Card Title</CardTitle>)
    expect(screen.getByText('My Card Title')).toBeInTheDocument()
  })

  it('has data-slot="card-title"', () => {
    const { container } = render(<CardTitle>Title</CardTitle>)
    expect(container.querySelector('[data-slot="card-title"]')).toBeInTheDocument()
  })
})

describe('CardDescription', () => {
  it('renders description text', () => {
    render(<CardDescription>A brief description</CardDescription>)
    expect(screen.getByText('A brief description')).toBeInTheDocument()
  })

  it('has data-slot="card-description"', () => {
    const { container } = render(<CardDescription>Desc</CardDescription>)
    expect(container.querySelector('[data-slot="card-description"]')).toBeInTheDocument()
  })
})

describe('CardAction', () => {
  it('renders action content', () => {
    render(<CardAction><button>Edit</button></CardAction>)
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })

  it('has data-slot="card-action"', () => {
    const { container } = render(<CardAction>Action</CardAction>)
    expect(container.querySelector('[data-slot="card-action"]')).toBeInTheDocument()
  })
})

describe('CardContent', () => {
  it('renders content children', () => {
    render(<CardContent>Body text</CardContent>)
    expect(screen.getByText('Body text')).toBeInTheDocument()
  })

  it('has data-slot="card-content"', () => {
    const { container } = render(<CardContent>Content</CardContent>)
    expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument()
  })
})

describe('CardFooter', () => {
  it('renders footer children', () => {
    render(<CardFooter>Footer text</CardFooter>)
    expect(screen.getByText('Footer text')).toBeInTheDocument()
  })

  it('has data-slot="card-footer"', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>)
    expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument()
  })
})

describe('Card composition', () => {
  it('renders a full card with all sub-components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Monthly overview</CardDescription>
          <CardAction><button>More</button></CardAction>
        </CardHeader>
        <CardContent>Main content here</CardContent>
        <CardFooter>Footer info</CardFooter>
      </Card>,
    )
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('Monthly overview')).toBeInTheDocument()
    expect(screen.getByText('Main content here')).toBeInTheDocument()
    expect(screen.getByText('Footer info')).toBeInTheDocument()
  })
})
