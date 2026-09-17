import type { HighlightProps } from '../../utils/highlight'

export type RadioValue = string | number | boolean

export interface RadioProps extends HighlightProps {
  modelValue?: RadioValue
  value: RadioValue
  name?: string
  disabled?: boolean
  customClass?: string
}
