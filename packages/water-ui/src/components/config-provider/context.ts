import { computed, inject, provide, type ComputedRef, type InjectionKey } from 'vue'

export type WtComponentSize = 'small' | 'medium' | 'large'

export interface WtConfig {
  theme: 'light' | 'dark' | 'system'
  size: WtComponentSize
  prefix: string
}

export const wtConfigKey: InjectionKey<ComputedRef<WtConfig>> = Symbol('wtConfig')

export function provideConfig(config: () => WtConfig) {
  provide(wtConfigKey, computed(config))
}

export function useConfig() {
  return inject(wtConfigKey, null)
}

export function resolveSize(localSize: () => WtComponentSize | undefined) {
  const config = useConfig()
  return computed(() => localSize() ?? config?.value.size ?? 'medium')
}
