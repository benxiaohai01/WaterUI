export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

export interface DrawerProps {
  modelValue?: boolean
  title?: string
  placement?: DrawerPlacement
  size?: string
  closeOnMask?: boolean
  closable?: boolean
  customClass?: string
}
