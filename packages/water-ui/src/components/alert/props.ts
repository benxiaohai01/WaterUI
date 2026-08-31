export type AlertType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface AlertProps {
  type?: AlertType
  title?: string
  description?: string
  closable?: boolean
  showIcon?: boolean
  customClass?: string
}
