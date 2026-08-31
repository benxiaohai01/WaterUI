export interface TourStep {
  /** 步骤标题 */
  title?: string
  /** 步骤描述 */
  description?: string
  /** 目标元素选择器（不填则居中显示） */
  target?: string
  /** 气泡位置 */
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'center'
  /** 自定义内容插槽名 */
  slot?: string
}

export interface TourProps {
  /** 是否显示引导 */
  modelValue?: boolean
  /** 引导步骤配置 */
  steps?: TourStep[]
  /** 当前步骤索引（v-model:current） */
  current?: number
  /** 是否显示遮罩 */
  mask?: boolean
  /** 遮罩颜色 */
  maskColor?: string
  /** 上一一步按钮文案 */
  prevText?: string
  /** 下一步按钮文案 */
  nextText?: string
  /** 完成按钮文案 */
  doneText?: string
  /** 自定义类名 */
  customClass?: string
}
