import type { HighlightProps } from '../../utils/highlight'

export interface SliderProps extends HighlightProps {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  showValue?: boolean
}
