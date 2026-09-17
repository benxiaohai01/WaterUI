import type { HighlightProps } from '../../utils/highlight'

export type SplitterDirection = 'horizontal' | 'vertical'

export interface SplitterProps extends HighlightProps {
  /** 分隔方向：horizontal 左右 / vertical 上下 */
  direction?: SplitterDirection
  /** 第一个面板的尺寸（像素），拖动时实时更新 */
  modelValue?: number
  /** 最小尺寸（px） */
  min?: number
  /** 最大尺寸（px） */
  max?: number
  /** 键盘方向键调整步长（px） */
  step?: number
  /** 分隔条宽度（px） */
  barSize?: number
  /** 自定义类名 */
  customClass?: string
}
