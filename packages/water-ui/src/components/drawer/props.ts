import type { HighlightProps } from '../../utils/highlight'

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

export interface DrawerProps extends HighlightProps {
  modelValue?: boolean
  title?: string
  placement?: DrawerPlacement
  size?: string
  closeOnMask?: boolean
  closable?: boolean
  customClass?: string
}
