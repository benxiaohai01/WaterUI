import type { MessageType } from '../message/props'
import type { HighlightProps } from '../../utils/highlight'

export type { MessageType as NotificationType }

export interface NotificationProps extends HighlightProps {
  title?: string
  message?: string
  type?: MessageType
  duration?: number
  showClose?: boolean
  offset?: number
  customClass?: string
}

export interface NotificationOptions extends HighlightProps {
  title?: string
  message: string
  type?: MessageType
  duration?: number
  showClose?: boolean
  customClass?: string
}
