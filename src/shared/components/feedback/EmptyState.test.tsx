import { render, screen } from '@testing-library/react'
import { EmptyState } from './EmptyState'

test('shows the given message', () => {
  render(<EmptyState message="No uploads yet" />)
  expect(screen.getByText('No uploads yet')).toBeInTheDocument()
})
