import type { HighlightProps } from '../../utils/highlight'

export type AlertType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface AlertProps extends HighlightProps {
  type?: AlertType
  title?: string
  description?: string
  closable?: boolean
  showIcon?: boolean
  /** 受控可见性，支持 v-model:visible；不传则使用内部状态 */
  visible?: boolean
  customClass?: string
  customStyle?: Record<string, string | number>
}
