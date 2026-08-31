import { inject, provide, type InjectionKey } from 'vue'
import type { DropdownPlacement, DropdownTrigger } from './props'

export interface DropdownContext {
  trigger: DropdownTrigger
  placement: DropdownPlacement
  visible: boolean
  onCommand: (command: string | number) => void
  onItemClick: () => void
}

export const dropdownKey: InjectionKey<DropdownContext> = Symbol('wtDropdown')

export function provideDropdown(context: DropdownContext) {
  provide(dropdownKey, context)
}

export function useDropdown() {
  return inject(dropdownKey, null)
}
