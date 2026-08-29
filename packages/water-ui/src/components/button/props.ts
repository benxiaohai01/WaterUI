export type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ButtonSize = 'small' | 'medium' | 'large'
export type NativeButtonType = 'button' | 'submit' | 'reset'

export interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  plain?: boolean
  round?: boolean
  block?: boolean
  nativeType?: NativeButtonType
  customClass?: string
  customStyle?: Record<string, string | number>
}
