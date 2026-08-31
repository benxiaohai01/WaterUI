import { inject, provide, type InjectionKey } from 'vue'
import type { MenuMode, MenuTheme } from './props'

export interface SubMenuRegistration {
  index: string
  title: string
  disabled: boolean
}

export interface MenuContext {
  mode: MenuMode
  theme: MenuTheme
  collapse: boolean
  uniqueOpened: boolean
  activeIndex: string
  opened: string[]
  register: (subMenu: SubMenuRegistration) => void
  unregister: (index: string) => void
  select: (index: string) => void
  toggleOpen: (index: string) => void
  isOpen: (index: string) => boolean
}

export const menuKey: InjectionKey<MenuContext> = Symbol('wtMenu')

export function provideMenu(context: MenuContext) {
  provide(menuKey, context)
}

export function useMenu() {
  return inject(menuKey, null)
}
