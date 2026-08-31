export type MenuMode = 'vertical' | 'horizontal'
export type MenuTheme = 'light' | 'dark'

export interface MenuItemProps {
  /** 菜单项标识 */
  index?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface SubMenuProps {
  /** 子菜单标题 */
  title?: string
  /** 子菜单标识 */
  index?: string
  /** 是否默认展开 */
  defaultOpened?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface MenuProps {
  /** 当前激活菜单项标识（v-model） */
  modelValue?: string
  /** 默认激活菜单项标识（非受控场景） */
  defaultActive?: string
  /** 展示模式 */
  mode?: MenuMode
  /** 主题 */
  theme?: MenuTheme
  /** 是否折叠（垂直模式） */
  collapse?: boolean
  /** 是否唯一展开子菜单 */
  uniqueOpened?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface MenuEmits {
  'update:modelValue': [index: string]
  /** 菜单项被选中 */
  select: [index: string]
  /** 子菜单展开状态变化 */
  'submenu-change': [index: string, opened: boolean]
}
