import type { HighlightProps } from '../../utils/highlight'

export interface ScrollbarProps extends HighlightProps {
  /** 内容区域高度（不设置则跟随内容撑开） */
  height?: string | number
  /** 内容区域最大高度 */
  maxHeight?: string | number
  /** 是否始终显示轨道 */
  alwaysShow?: boolean
  /** 滚动条最小长度（px） */
  minThumbSize?: number
  /** 自定义类名 */
  customClass?: string
}
