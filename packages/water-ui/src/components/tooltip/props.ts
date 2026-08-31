export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left'
export type TooltipTrigger = 'hover' | 'click'

export interface TooltipProps {
  content?: string
  placement?: TooltipPlacement
  trigger?: TooltipTrigger
  disabled?: boolean
  customClass?: string
}
