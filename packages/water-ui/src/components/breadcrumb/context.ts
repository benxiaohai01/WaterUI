import { inject, provide, type InjectionKey, type Ref } from 'vue'

export interface BreadcrumbContext {
  /** 分隔符（getter 形式，父级 props 变化后仍取最新值） */
  readonly separator: string
  /** 子项注册顺序（用于判定最后一项） */
  readonly items: Ref<object[]>
  /** 注册子项 */
  registerItem: (item: object) => void
  /** 注销子项 */
  unregisterItem: (item: object) => void
}

export const breadcrumbKey: InjectionKey<BreadcrumbContext> = Symbol('wtBreadcrumb')

export function provideBreadcrumb(context: BreadcrumbContext) {
  provide(breadcrumbKey, context)
}

export function useBreadcrumb() {
  return inject(breadcrumbKey, null)
}
