import type { HighlightProps } from '../../utils/highlight'

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left'
export type TooltipTrigger = 'hover' | 'click'

export interface TooltipProps extends HighlightProps {
  content?: string
  placement?: TooltipPlacement
  trigger?: TooltipTrigger
  disabled?: boolean
  customClass?: string
}
