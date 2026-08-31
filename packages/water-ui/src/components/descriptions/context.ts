import { inject, provide, type InjectionKey } from 'vue'

export interface DescriptionsContext {
  column: number
  bordered: boolean
}

export const descriptionsKey: InjectionKey<DescriptionsContext> = Symbol('wtDescriptions')

export function provideDescriptions(context: DescriptionsContext) {
  provide(descriptionsKey, context)
}

export function useDescriptions() {
  return inject(descriptionsKey, null)
}
