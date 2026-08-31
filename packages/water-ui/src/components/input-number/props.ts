export type InputNumberSize = 'small' | 'medium' | 'large'

export interface InputNumberProps {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  precision?: number
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  controls?: boolean
  size?: InputNumberSize
  customClass?: string
}
