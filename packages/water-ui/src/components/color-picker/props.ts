export type ColorPickerSize = 'small' | 'medium' | 'large'

export interface ColorPickerProps {
  modelValue?: string
  disabled?: boolean
  size?: ColorPickerSize
  customClass?: string
}
