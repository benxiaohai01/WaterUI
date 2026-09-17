import type { HighlightProps } from '../../utils/highlight'

export interface EmptyProps extends HighlightProps {
  /** 空状态描述文案 */
  description?: string
  /** 图片尺寸 */
  imageSize?: number
  /** 自定义类名 */
  customClass?: string
}
