import type { HighlightProps } from '../../utils/highlight'

export interface CheckboxProps extends HighlightProps {
  modelValue?: boolean
  disabled?: boolean
  indeterminate?: boolean
  customClass?: string
}
