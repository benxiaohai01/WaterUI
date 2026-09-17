import type { HighlightProps } from '../../utils/highlight'

export type SwitchSize = 'small' | 'medium' | 'large'

export interface SwitchProps extends HighlightProps {
  modelValue?: boolean
  disabled?: boolean
  size?: SwitchSize
  activeText?: string
  inactiveText?: string
}
