import { inject, provide, type InjectionKey } from 'vue'

export interface AnchorContext {
  /** 当前激活锚点 */
  activeHref: string
  /** 点击锚点 */
  onClick: (href: string) => void
  /** 注册锚点 */
  register: (href: string) => void
  /** 注销锚点 */
  unregister: (href: string) => void
}

export const anchorKey: InjectionKey<AnchorContext> = Symbol('wtAnchor')

export function provideAnchor(context: AnchorContext) {
  provide(anchorKey, context)
}

export function useAnchor() {
  return inject(anchorKey, null)
}
