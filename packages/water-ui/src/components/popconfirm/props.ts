import type { MessageBoxType } from '../message-box/props'

export type PopconfirmType = MessageBoxType

export interface PopconfirmProps {
  title?: string
  content?: string
  type?: PopconfirmType
  confirmText?: string
  cancelText?: string
  placement?: 'top' | 'right' | 'bottom' | 'left'
  customClass?: string
}
