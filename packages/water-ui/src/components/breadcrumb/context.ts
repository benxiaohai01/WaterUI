import { inject, provide, type InjectionKey } from 'vue'

export interface BreadcrumbContext {
  separator: string
}

export const breadcrumbKey: InjectionKey<BreadcrumbContext> = Symbol('wtBreadcrumb')

export function provideBreadcrumb(context: BreadcrumbContext) {
  provide(breadcrumbKey, context)
}

export function useBreadcrumb() {
  return inject(breadcrumbKey, null)
}
