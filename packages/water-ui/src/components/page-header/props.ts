export interface PageHeaderProps {
  /** 标题 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 面包屑分隔符 */
  breadcrumbSeparator?: string
  /** 是否显示返回按钮 */
  showBack?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface PageHeaderEmits {
  /** 点击返回按钮 */
  back: []
}
