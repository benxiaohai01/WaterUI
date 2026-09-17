import type { HighlightProps } from '../../utils/highlight'

export type MessageBoxType = 'info' | 'success' | 'warning' | 'error'

export interface MessageBoxProps extends HighlightProps {
  modelValue?: boolean
  title?: string
  message?: string
  type?: MessageBoxType
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  maskClosable?: boolean
  customClass?: string
}
