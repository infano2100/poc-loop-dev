import { Tooltip } from 'antd'
import { Children, cloneElement, type ReactElement } from 'react'

interface ComingSoonProps {
  children: ReactElement<{ disabled?: boolean }>
}

export function ComingSoon({ children }: ComingSoonProps) {
  return (
    <Tooltip title="Coming soon">
      <span style={{ display: 'inline-block' }}>
        {cloneElement(Children.only(children), { disabled: true })}
      </span>
    </Tooltip>
  )
}
