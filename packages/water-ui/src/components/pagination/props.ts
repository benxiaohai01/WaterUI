import type { HighlightProps } from '../../utils/highlight'

export interface PaginationProps extends HighlightProps {
  /** 当前页码（从 1 开始），支持 v-model:current */
  current?: number
  /** 每页条数，支持 v-model:pageSize */
  pageSize?: number
  /** 总条数 */
  total: number
  /** 页码按钮数量 */
  pagerCount?: number
  /** 是否显示总数 */
  showTotal?: boolean
  /** 是否显示快速跳转 */
  showJumper?: boolean
  /** 是否显示每页条数切换器 */
  showSizeChanger?: boolean
  /** 每页条数可选项 */
  pageSizes?: number[]
  /** 自定义类名 */
  customClass?: string
}

export interface PaginationEmits {
  /** 当前页码更新（v-model:current） */
  'update:current': [current: number]
  /** 每页条数更新（v-model:pageSize） */
  'update:pageSize': [pageSize: number]
  /** 页码变化 */
  change: [current: number, pageSize: number]
  /** 每页条数变化 */
  pageSizeChange: [pageSize: number]
}
