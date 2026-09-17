import type { HighlightProps } from '../../utils/highlight'

export type InputNumberSize = 'small' | 'medium' | 'large'

export interface InputNumberProps extends HighlightProps {
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
