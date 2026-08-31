export type DatePickerType = 'date' | 'datetime'
export type DatePickerSize = 'small' | 'medium' | 'large'

export interface DatePickerProps {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  pickerType?: DatePickerType
  size?: DatePickerSize
  customClass?: string
}
