export type TextSize = 'small' | 'medium' | 'large'
export type TextType = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'

export interface TextProps {
  as?: string
  size?: TextSize
  type?: TextType
  strong?: boolean
  italic?: boolean
  block?: boolean
  truncate?: boolean
  customClass?: string
}
