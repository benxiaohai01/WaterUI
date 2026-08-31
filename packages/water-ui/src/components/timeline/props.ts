export type TimelineItemType = 'default' | 'success' | 'warning' | 'danger' | 'primary'

export interface TimelineProps {
  /** 自定义类名 */
  customClass?: string
}

export interface TimelineItemProps {
  /** 时间 */
  timestamp?: string
  /** 节点类型（决定颜色） */
  type?: TimelineItemType
  /** 节点是否空心 */
  hollow?: boolean
  /** 自定义类名 */
  customClass?: string
}
