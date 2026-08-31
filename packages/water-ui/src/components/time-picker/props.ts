export type TimePickerSize = 'small' | 'medium' | 'large'

export interface TimePickerProps {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  size?: TimePickerSize
  customClass?: string
}
