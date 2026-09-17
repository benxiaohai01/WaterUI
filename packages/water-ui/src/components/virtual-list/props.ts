export interface VirtualListProps<T = unknown> {
  /** 列表数据 */
  data: T[]
  /** 每一项的高度（px），不定高时该项必填 */
  itemSize: number
  /** 可视区高度（px）；传入 CSS 值时以容器实测高度计算可视条目数 */
  height?: number | string
  /** 预渲染缓冲数量（上下各） */
  buffer?: number
  /** 列表项唯一键：字符串时取 item[itemKey]，函数时返回键值；不传时回退索引 */
  itemKey?: string | ((item: T, index: number) => string | number)
  /** 自定义类名 */
  customClass?: string
}
