import type { HighlightProps } from '../../utils/highlight'

export type TextareaSize = 'small' | 'medium' | 'large'

export interface TextareaProps extends HighlightProps {
  modelValue?: string | number
  placeholder?: string
  rows?: number
  disabled?: boolean
  readonly?: boolean
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  maxlength?: number
  showWordLimit?: boolean
  size?: TextareaSize
  customClass?: string
}
