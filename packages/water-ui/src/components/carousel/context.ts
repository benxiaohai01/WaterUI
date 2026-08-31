import { inject, provide, type InjectionKey } from 'vue'

export interface CarouselContext {
  activeIndex: number
  /** 注册轮播项，返回该项在轮播中的索引 */
  register: () => number
  /** 注销轮播项 */
  unregister: (index: number) => void
}

export const carouselKey: InjectionKey<CarouselContext> = Symbol('wtCarousel')

export function provideCarousel(context: CarouselContext) {
  provide(carouselKey, context)
}

export function useCarousel() {
  return inject(carouselKey, null)
}
