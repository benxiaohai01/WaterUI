import { inject, provide, type InjectionKey } from 'vue'

export interface SelectOptionValue {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

export interface SelectOptionsContext {
  register: (option: SelectOptionValue) => void
  unregister: (option: SelectOptionValue) => void
}

export const selectOptionsKey: InjectionKey<SelectOptionsContext> = Symbol('wtSelectOptions')

export function provideSelectOptions(context: SelectOptionsContext) {
  provide(selectOptionsKey, context)
}

export function useSelectOptions() {
  return inject(selectOptionsKey, null)
}
