import { inject, provide, type InjectionKey } from 'vue'

export interface CollapseContext {
  activeKey: string | string[]
  accordion: boolean
  /** 判断面板是否激活 */
  isActive: (name: string) => boolean
  /** 切换面板展开状态 */
  toggle: (name: string) => void
}

export const collapseKey: InjectionKey<CollapseContext> = Symbol('wtCollapse')

export function provideCollapse(context: CollapseContext) {
  provide(collapseKey, context)
}

export function useCollapse() {
  return inject(collapseKey, null)
}
