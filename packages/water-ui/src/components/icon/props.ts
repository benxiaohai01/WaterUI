export type IconName =
  | 'search'
  | 'arrow-right'
  | 'arrow-left'
  | 'menu'
  | 'moon'
  | 'sun'
  | 'github'
  | 'copy'
  | 'check'
  | 'chevron-right'
  | 'chevron-down'
  | 'close'
  | 'code'
  | 'external'
  | 'home'

export interface IconProps {
  name: IconName
  size?: number | string
  color?: string
  wrapped?: boolean
}
