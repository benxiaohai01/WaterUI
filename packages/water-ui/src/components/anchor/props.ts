export type AnchorScrollContainer = string | HTMLElement | Window | (() => HTMLElement | Window | null)

export interface AnchorLinkProps {
  /** 锚点链接（对应页面元素 id） */
  href: string
  /** 显示标题 */
  title?: string
  /** 自定义类名 */
  customClass?: string
}

export interface AnchorProps {
  /** 当前激活的锚点（v-model） */
  modelValue?: string
  /** 默认激活的锚点（非受控场景） */
  defaultActive?: string
  /** 滚动容器 */
  container?: AnchorScrollContainer
  /** 滚动偏移量（px） */
  offset?: number
  /** 是否监听点击事件自动高亮 */
  clickActive?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface AnchorEmits {
  'update:modelValue': [href: string]
  /** 激活锚点变化 */
  change: [href: string]
  /** 点击锚点链接 */
  click: [href: string]
}
