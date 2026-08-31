export interface StatisticProps {
  /** 数值 */
  value: number
  /** 数值标题 */
  title?: string
  /** 数值前缀 */
  prefix?: string
  /** 数值后缀 */
  suffix?: string
  /** 小数位 */
  precision?: number
  /** 千分位分隔 */
  groupSeparator?: boolean
  /** 数值颜色 */
  color?: string
  /** 自定义类名 */
  customClass?: string
}
