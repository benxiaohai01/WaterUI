export type PopoverPlacement = 'top' | 'right' | 'bottom' | 'left'
export type PopoverTrigger = 'hover' | 'click'

export interface PopoverProps {
  title?: string
  content?: string
  placement?: PopoverPlacement
  trigger?: PopoverTrigger
  width?: string
  disabled?: boolean
  customClass?: string
}
