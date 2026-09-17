import type { HighlightProps } from '../../utils/highlight'

export type TabsType = 'text' | 'card'
export type TabsPosition = 'top' | 'right' | 'bottom' | 'left'

export interface TabPaneProps {
  /** 选项卡标题 */
  label?: string
  /** 选项卡唯一标识（默认取索引） */
  name?: string | number
  /** 是否禁用 */
  disabled?: boolean
  /** 是否懒渲染（首次激活时才挂载内容） */
  lazy?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface TabsProps extends HighlightProps {
  /** 当前激活选项卡标识（v-model） */
  modelValue?: string | number
  /** 默认激活选项卡标识（非受控场景） */
  defaultActive?: string | number
  /** 展示类型 */
  type?: TabsType
  /** 标签位置 */
  position?: TabsPosition
  /** 是否可关闭选项卡（配合 closable 事件使用） */
  closable?: boolean
  /** 是否允许新增选项卡 */
  addable?: boolean
  /** 是否允许删除选项卡 */
  editable?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface TabsEmits {
  'update:modelValue': [name: string | number]
  /** 切换选项卡 */
  change: [name: string | number]
  /** 关闭选项卡 */
  close: [name: string | number]
  /** 新增选项卡 */
  add: []
  /** 标签切换动画结束 */
  'tab-change'?: [name: string | number]
}
