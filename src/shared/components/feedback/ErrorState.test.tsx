import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorState } from './ErrorState'

test('shows the default message and calls onRetry', async () => {
  const onRetry = vi.fn()
  render(<ErrorState onRetry={onRetry} />)
  expect(screen.getByText('Could not load data')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(onRetry).toHaveBeenCalledTimes(1)
})

test('hides the retry button without a handler and accepts a custom message', () => {
  render(<ErrorState message="Boom" />)
  expect(screen.getByText('Boom')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument()
})
