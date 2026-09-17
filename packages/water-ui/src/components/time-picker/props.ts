import type { HighlightProps } from '../../utils/highlight'

export type TimePickerSize = 'small' | 'medium' | 'large'

export interface TimePickerProps extends HighlightProps {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  size?: TimePickerSize
  customClass?: string
}
