import type { HighlightProps } from '../../utils/highlight'

export type MessageType = 'info' | 'success' | 'warning' | 'error'

export interface MessageProps extends HighlightProps {
  message?: string
  type?: MessageType
  duration?: number
  showClose?: boolean
  offset?: number
  customClass?: string
}

export interface MessageOptions extends HighlightProps {
  message: string
  type?: MessageType
  duration?: number
  showClose?: boolean
  customClass?: string
}
