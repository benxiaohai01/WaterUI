export interface BackTopProps {
  /** 滚动高度达到该值后显示按钮（px） */
  visibilityHeight?: number
  /** 目标滚动容器 */
  container?: HTMLElement | Window | (() => HTMLElement | Window | null)
  /** 滚动动画时长（ms） */
  duration?: number
  /** 自定义类名 */
  customClass?: string
}

export interface BackTopEmits {
  /** 点击返回顶部 */
  click: [event: MouseEvent]
}
