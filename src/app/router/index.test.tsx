import { render, screen } from '@testing-library/react'
import { RouterProvider } from 'react-router-dom'
import { createAppRouter } from './index'

function renderAt(path: string) {
  render(<RouterProvider router={createAppRouter([path])} />)
}

test('renders the login placeholder at /login', () => {
  renderAt('/login')
  expect(screen.getByRole('heading', { level: 1, name: 'Login' })).toBeInTheDocument()
})

test('renders the dashboard placeholder at /', () => {
  renderAt('/')
  expect(screen.getByRole('heading', { level: 1, name: 'CatToon' })).toBeInTheDocument()
})

test('redirects unknown paths to /', () => {
  renderAt('/nope')
  expect(screen.getByRole('heading', { level: 1, name: 'CatToon' })).toBeInTheDocument()
})
