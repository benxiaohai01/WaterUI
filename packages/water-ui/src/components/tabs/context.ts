import { inject, provide, type InjectionKey } from 'vue'
import type { TabsType } from './props'

export interface TabPaneRegistration {
  /** 选项卡标题 */
  label: string
  /** 选项卡标识 */
  name: string | number
  /** 是否禁用 */
  disabled: boolean
  /** 是否懒渲染 */
  lazy: boolean
}

export interface TabsContext {
  type: TabsType
  activeName: string | number
  closable: boolean
  addable: boolean
  editable: boolean
  panes: TabPaneRegistration[]
  register: (pane: TabPaneRegistration) => void
  unregister: (name: string | number) => void
  select: (name: string | number) => void
  close: (name: string | number) => void
  add: () => void
}

export const tabsKey: InjectionKey<TabsContext> = Symbol('wtTabs')

export function provideTabs(context: TabsContext) {
  provide(tabsKey, context)
}

export function useTabs() {
  return inject(tabsKey, null)
}
