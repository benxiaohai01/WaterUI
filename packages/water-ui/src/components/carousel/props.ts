export interface CarouselProps {
  /** 当前激活索引 */
  activeIndex?: number
  /** 是否自动播放 */
  autoplay?: boolean
  /** 自动播放间隔（毫秒） */
  interval?: number
  /** 是否显示指示器 */
  indicator?: boolean
  /** 是否显示箭头 */
  arrow?: boolean
  /** 是否循环 */
  loop?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface CarouselEmits {
  /** 激活索引变化 */
  change: [index: number]
  /** 激活索引双向绑定 */
  'update:activeIndex': [index: number]
}

export interface CarouselItemProps {
  /** 自定义类名 */
  customClass?: string
}
