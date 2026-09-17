<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { CarouselItemProps } from './props'
import { useCarousel, type CarouselItemInstance } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtCarouselItem' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<CarouselItemProps>(), {
  customClass: ''
})

/* 注入父级上下文 */
const carousel = useCarousel()

/* 响应式状态：本项索引 */
const index = ref(-1)

/* 响应式状态：本项根元素 */
const rootRef = ref<HTMLElement | null>(null)

/* 派生状态：是否激活 */
const isActive = computed(() => carousel?.activeIndex === index.value)

/* 注册实例：暴露根元素（供父级按 DOM 顺序排序）与索引写回 */
const instance: CarouselItemInstance = {
  get el() {
    return rootRef.value
  },
  setIndex: (value: number) => {
    index.value = value
  }
}

onMounted(() => carousel?.register(instance))
onBeforeUnmount(() => carousel?.unregister(instance))
</script>

<template>
  <div
    ref="rootRef"
    v-show="isActive"
    :class="['wt-carousel-item', props.customClass]"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.wt-carousel-item {
  /* 宽度 */
  width: 100%;
  /* 高度 */
  height: 100%;
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴对齐方式 */
  justify-content: center;
  /* 过渡 */
  transition: opacity var(--wt-motion-base) ease;
}
</style>
