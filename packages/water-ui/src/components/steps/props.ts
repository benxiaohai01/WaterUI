export type StepStatus = 'wait' | 'process' | 'finish' | 'error'
export type StepsDirection = 'horizontal' | 'vertical'

export interface StepProps {
  /** 步骤标题 */
  title?: string
  /** 步骤描述 */
  description?: string
  /** 自定义步骤状态，覆盖父级 Steps 的状态推导 */
  status?: StepStatus
  /** 自定义类名 */
  customClass?: string
}

export interface StepsProps {
  /** 当前激活步骤索引（从 0 开始） */
  active?: number
  /** 展示方向 */
  direction?: StepsDirection
  /** 当前步骤状态：process / finish / error */
  processStatus?: StepStatus
  /** 完成步骤状态 */
  finishStatus?: StepStatus
  /** 步骤条总数量（优先取父级 Steps 的 length） */
  length?: number
  /** 是否只读（不响应点击） */
  readonly?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface StepsEmits {
  /** 点击某个步骤 */
  select: [index: number]
}
