import type { HighlightProps } from '../../utils/highlight'

export interface ImageProps extends HighlightProps {
  /** 图片地址 */
  src: string
  /** 替代文本 */
  alt?: string
  /** 宽度 */
  width?: string
  /** 高度 */
  height?: string
  /** 填充模式 */
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  /** 圆角类型 */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'round'
  /** 是否开启预览 */
  preview?: boolean
  /** 自定义类名 */
  customClass?: string
}
