import type { MessageType } from '../message/props'

export type { MessageType as NotificationType }

export interface NotificationProps {
  title?: string
  message?: string
  type?: MessageType
  duration?: number
  showClose?: boolean
  offset?: number
  customClass?: string
}

export interface NotificationOptions {
  title?: string
  message: string
  type?: MessageType
  duration?: number
  showClose?: boolean
  customClass?: string
}
