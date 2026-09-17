import type { HighlightProps } from '../../utils/highlight'

export type TagType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface TagProps extends HighlightProps {
  type?: TagType
  closable?: boolean
  round?: boolean
  disabled?: boolean
  customClass?: string
}
