import { APP_NAME } from '@/config/app'
import { PRIMARY_COLOR } from '@/styles/theme'

interface LogoProps {
  showName?: boolean
}

export function Logo({ showName = true }: LogoProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <svg role="img" aria-label={APP_NAME} width="40" height="28" viewBox="0 0 40 28">
        <path d="M2 26 L8 2 L16 12 L24 12 L32 2 L38 26 Z" fill={PRIMARY_COLOR} />
      </svg>
      {showName && (
        <span style={{ fontSize: 24, fontWeight: 500, color: '#005b96' }}>{APP_NAME}</span>
      )}
    </span>
  )
}
