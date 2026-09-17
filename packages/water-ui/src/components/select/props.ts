import type { HighlightProps } from '../../utils/highlight'

export type SelectSize = 'small' | 'medium' | 'large'

export interface SelectOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

export interface SelectProps extends HighlightProps {
  modelValue?: string | number | boolean
  options?: SelectOption[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: SelectSize
  customClass?: string
}
