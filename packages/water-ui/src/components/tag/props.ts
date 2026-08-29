export type TagType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface TagProps {
  type?: TagType
  closable?: boolean
  round?: boolean
  disabled?: boolean
  customClass?: string
}
