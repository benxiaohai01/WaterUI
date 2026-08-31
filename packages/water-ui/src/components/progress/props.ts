export type ProgressType = 'line' | 'circle'
export type ProgressStatus = 'normal' | 'success' | 'warning' | 'danger'

export interface ProgressProps {
  /** 进度百分比（0-100） */
  percentage?: number
  /** 展示类型 */
  type?: ProgressType
  /** 状态（决定颜色） */
  status?: ProgressStatus
  /** 线条高度 */
  strokeWidth?: number
  /** 圆形尺寸 */
  size?: number
  /** 是否显示文字 */
  showText?: boolean
  /** 自定义类名 */
  customClass?: string
}
