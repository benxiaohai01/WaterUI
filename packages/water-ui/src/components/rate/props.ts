import type { HighlightProps } from '../../utils/highlight'

export interface RateProps extends HighlightProps {
  modelValue?: number
  max?: number
  disabled?: boolean
  allowHalf?: boolean
  customClass?: string
}
