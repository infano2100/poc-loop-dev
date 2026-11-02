import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComingSoon } from './ComingSoon'

test('disables its child and shows the hint on hover', async () => {
  const onClick = vi.fn()
  render(
    <ComingSoon>
      <button onClick={onClick}>Google</button>
    </ComingSoon>,
  )
  const button = screen.getByRole('button', { name: 'Google' })
  expect(button).toBeDisabled()
  await userEvent.hover(button.parentElement as HTMLElement)
  expect(await screen.findByText('Coming soon')).toBeInTheDocument()
  expect(onClick).not.toHaveBeenCalled()
})
