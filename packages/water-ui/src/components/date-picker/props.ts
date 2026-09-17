import type { HighlightProps } from '../../utils/highlight'

export type DatePickerType = 'date' | 'datetime'
export type DatePickerSize = 'small' | 'medium' | 'large'

export interface DatePickerProps extends HighlightProps {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  pickerType?: DatePickerType
  size?: DatePickerSize
  customClass?: string
}
