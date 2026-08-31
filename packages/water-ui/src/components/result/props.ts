export type ResultStatus = 'success' | 'warning' | 'danger' | 'info' | '404' | '500'

export interface ResultProps {
  /** 结果状态 */
  status?: ResultStatus
  /** 主标题 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 自定义类名 */
  customClass?: string
}
