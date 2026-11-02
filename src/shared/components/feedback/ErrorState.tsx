import { Button, Result } from 'antd'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'Could not load data', onRetry }: ErrorStateProps) {
  return (
    <Result
      status="error"
      title={message}
      extra={onRetry && <Button onClick={onRetry}>Retry</Button>}
    />
  )
}
