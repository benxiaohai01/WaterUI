export interface BreadcrumbItemProps {
  /** 跳转链接，不传则渲染为普通文本 */
  to?: string
  /** 链接打开方式 */
  target?: string
  /** 是否替换当前路由（配合 to 使用） */
  replace?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface BreadcrumbProps {
  /** 分隔符内容，可为字符或 HTML 片段 */
  separator?: string
  /** 自定义类名 */
  customClass?: string
}
