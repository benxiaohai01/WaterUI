export type BadgeType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface BadgeProps {
  /** 徽标显示内容（数字或文本） */
  value?: number | string
  /** 最大值，超出后显示 max+（仅数字生效） */
  max?: number
  /** 是否使用小圆点模式 */
  dot?: boolean
  /** 是否隐藏徽标 */
  hidden?: boolean
  /** 徽标语义类型 */
  type?: BadgeType
  /** 自定义类名 */
  customClass?: string
}
