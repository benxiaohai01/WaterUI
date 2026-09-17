import type { HighlightProps } from '../../utils/highlight'

export type ColorPickerSize = 'small' | 'medium' | 'large'

export interface ColorPickerProps extends HighlightProps {
  modelValue?: string
  disabled?: boolean
  size?: ColorPickerSize
  customClass?: string
}
