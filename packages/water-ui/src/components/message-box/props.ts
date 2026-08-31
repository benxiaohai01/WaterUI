export type MessageBoxType = 'info' | 'success' | 'warning' | 'error'

export interface MessageBoxProps {
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
