import type { HighlightProps } from '../../utils/highlight'

export interface AffixProps extends HighlightProps {
  /** 距离视口顶部的偏移量（px） */
  offset?: number
  /** 滚动容器（默认 window） */
  container?: HTMLElement | Window | (() => HTMLElement | Window | null)
  /** 自定义类名 */
  customClass?: string
}

export interface AffixEmits {
  /** 固定状态变化 */
  change: [fixed: boolean]
}
