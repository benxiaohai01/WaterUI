import type { HighlightProps } from '../../utils/highlight'

export interface DialogProps extends HighlightProps {
  modelValue?: boolean
  title?: string
  width?: string
  closeOnMask?: boolean
  closable?: boolean
  customClass?: string
}
