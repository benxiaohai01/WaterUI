import { inject, provide, type InjectionKey } from 'vue'

export interface CarouselItemInstance {
  /** 轮播项根元素（用于按 DOM 顺序重排索引） */
  el: HTMLElement | null
  /** 写回轮播项索引 */
  setIndex: (index: number) => void
}

export interface CarouselContext {
  activeIndex: number
  /** 注册轮播项 */
  register: (item: CarouselItemInstance) => void
  /** 注销轮播项 */
  unregister: (item: CarouselItemInstance) => void
}

export const carouselKey: InjectionKey<CarouselContext> = Symbol('wtCarousel')

export function provideCarousel(context: CarouselContext) {
  provide(carouselKey, context)
}

export function useCarousel() {
  return inject(carouselKey, null)
}
