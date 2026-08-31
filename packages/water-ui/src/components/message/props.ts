export type MessageType = 'info' | 'success' | 'warning' | 'error'

export interface MessageProps {
  message?: string
  type?: MessageType
  duration?: number
  showClose?: boolean
  customClass?: string
}

export interface MessageOptions {
  message: string
  type?: MessageType
  duration?: number
  showClose?: boolean
  customClass?: string
}
