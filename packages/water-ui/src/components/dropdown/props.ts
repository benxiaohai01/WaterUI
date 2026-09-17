import type { HighlightProps } from '../../utils/highlight'

export type DropdownTrigger = 'hover' | 'click'
export type DropdownPlacement = 'top' | 'right' | 'bottom' | 'left'

export interface DropdownItemProps {
  /** 点击时向上传递的命令值 */
  command?: string | number
  /** 是否禁用 */
  disabled?: boolean
  /** 是否分隔线 */
  divided?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface DropdownMenuProps extends HighlightProps {
  /** 自定义类名 */
  customClass?: string
}

export interface DropdownProps {
  /** 触发方式 */
  trigger?: DropdownTrigger
  /** 弹出方向 */
  placement?: DropdownPlacement
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface DropdownEmits {
  /** 点击菜单项 */
  command: [command: string | number]
  /** 展开/收起状态变化 */
  visibleChange: [visible: boolean]
}
