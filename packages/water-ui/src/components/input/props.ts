export type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'url' | 'color'
export type InputSize = 'small' | 'medium' | 'large'

export interface InputProps {
  modelValue?: string | number
  type?: InputType
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  size?: InputSize
  clearable?: boolean
  customClass?: string
}
