import { render, screen } from '@testing-library/react'
import { APP_NAME } from '@/config/app'
import { Logo } from './Logo'

test('renders the app name from the constant', () => {
  render(<Logo />)
  expect(screen.getByText(APP_NAME)).toBeInTheDocument()
})

test('can hide the name for the collapsed sidebar', () => {
  render(<Logo showName={false} />)
  expect(screen.queryByText(APP_NAME)).not.toBeInTheDocument()
  expect(screen.getByRole('img', { name: APP_NAME })).toBeInTheDocument()
})
