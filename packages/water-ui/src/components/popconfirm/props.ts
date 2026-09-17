import type { MessageBoxType } from '../message-box/props'
import type { HighlightProps } from '../../utils/highlight'

export type PopconfirmType = MessageBoxType

export interface PopconfirmProps extends HighlightProps {
  title?: string
  content?: string
  type?: PopconfirmType
  confirmText?: string
  cancelText?: string
  placement?: 'top' | 'right' | 'bottom' | 'left'
  /** 受控可见性，支持 v-model:visible；不传则使用内部状态 */
  visible?: boolean
  customClass?: string
}
