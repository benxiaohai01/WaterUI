export interface PaginationProps {
  /** 当前页码（从 1 开始） */
  current?: number
  /** 每页条数 */
  pageSize?: number
  /** 总条数 */
  total: number
  /** 页码按钮数量 */
  pagerCount?: number
  /** 是否显示总数 */
  showTotal?: boolean
  /** 是否显示快速跳转 */
  showJumper?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface PaginationEmits {
  /** 页码变化 */
  change: [current: number, pageSize: number]
  /** 每页条数变化 */
  pageSizeChange: [pageSize: number]
}
