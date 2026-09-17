import type { HighlightProps } from '../../utils/highlight'

export type PopoverPlacement = 'top' | 'right' | 'bottom' | 'left'
export type PopoverTrigger = 'hover' | 'click'

export interface PopoverProps extends HighlightProps {
  title?: string
  content?: string
  placement?: PopoverPlacement
  trigger?: PopoverTrigger
  width?: string
  /** 受控可见性，支持 v-model:visible；不传则使用内部状态 */
  visible?: boolean
  disabled?: boolean
  customClass?: string
}
