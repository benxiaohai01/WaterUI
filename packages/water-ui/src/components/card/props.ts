export interface CardProps {
  /** 卡片标题 */
  title?: string
  /** 是否显示边框 */
  bordered?: boolean
  /** 阴影显隐方式 */
  shadow?: 'hover' | 'always' | 'never'
  /** 自定义类名 */
  customClass?: string
}
