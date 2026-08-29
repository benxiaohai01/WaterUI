export type SwitchSize = 'small' | 'medium' | 'large'

export interface SwitchProps {
  modelValue?: boolean
  disabled?: boolean
  size?: SwitchSize
  activeText?: string
  inactiveText?: string
}
