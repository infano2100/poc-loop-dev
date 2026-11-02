import { render, screen } from '@testing-library/react'
import App from './App'

test('mounts the providers and the router', () => {
  render(<App />)
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
})
