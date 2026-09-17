import type { HighlightProps } from '../../utils/highlight'

export interface CollapseProps {
  /** 当前激活面板 key（可多选时用数组） */
  activeKey?: string | string[]
  /** 是否手风琴模式 */
  accordion?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface CollapseEmits {
  /** 激活面板变化 */
  change: [activeKey: string | string[]]
  /** 激活面板双向绑定 */
  'update:activeKey': [activeKey: string | string[]]
}

export interface CollapseItemProps extends HighlightProps {
  /** 面板唯一标识 */
  name: string
  /** 面板标题 */
  title?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  customClass?: string
}
