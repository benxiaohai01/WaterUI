export interface VirtualListProps<T = unknown> {
  /** 列表数据 */
  data: T[]
  /** 每一项的高度（px），不定高时该项必填 */
  itemSize: number
  /** 可视区高度（px） */
  height?: number | string
  /** 预渲染缓冲数量（上下各） */
  buffer?: number
  /** 自定义类名 */
  customClass?: string
}
