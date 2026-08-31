export interface DescriptionsProps {
  /** 标题 */
  title?: string
  /** 每行显示的列数 */
  column?: number
  /** 是否带边框 */
  bordered?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface DescriptionsItemProps {
  /** 字段标签 */
  label?: string
  /** 跨列数 */
  span?: number
  /** 自定义类名 */
  customClass?: string
}
