export interface SkeletonProps {
  /** 是否显示骨架屏 */
  loading?: boolean
  /** 是否显示头像骨架 */
  avatar?: boolean
  /** 标题行数 */
  titleRows?: number
  /** 段落行数 */
  paragraphRows?: number
  /** 是否开启动画 */
  animated?: boolean
  /** 自定义类名 */
  customClass?: string
}
