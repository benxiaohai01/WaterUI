import type { HighlightProps } from '../../utils/highlight'

export interface CalendarProps extends HighlightProps {
  /** 当前选中日期（YYYY-MM-DD） */
  modelValue?: string
  /** 默认年份 */
  year?: number
  /** 默认月份（1-12） */
  month?: number
  /** 是否显示农历/节假日占位（保留扩展位） */
  showExtra?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface CalendarEmits {
  /** 选中日期变化 */
  'update:modelValue': [value: string]
  /** 月份变化 */
  change: [year: number, month: number]
}
