import { useQueryClient } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { theme } from 'antd'
import { PRIMARY_COLOR } from '@/styles/theme'
import { AppProviders } from './AppProviders'

function QueryProbe() {
  const client = useQueryClient()
  return <span>{String(client.getDefaultOptions().queries?.retry)}</span>
}

function ThemeProbe() {
  const { token } = theme.useToken()
  return <span>{token.colorPrimary.toUpperCase()}</span>
}

test('provides the query client to children', () => {
  render(
    <AppProviders>
      <QueryProbe />
    </AppProviders>,
  )
  expect(screen.getByText('1')).toBeInTheDocument()
})

test('applies the AntD theme tokens', () => {
  render(
    <AppProviders>
      <ThemeProbe />
    </AppProviders>,
  )
  expect(screen.getByText(PRIMARY_COLOR)).toBeInTheDocument()
})
