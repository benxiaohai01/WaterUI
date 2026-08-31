<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { AffixProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtAffix' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<AffixProps>(), {
  offset: 0,
  container: undefined,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  change: [fixed: boolean]
}>()

/* 响应式状态：是否固定 */
const fixed = ref(false)

/* 响应式状态：占位高度 */
const placeholderHeight = ref(0)

/* 响应式状态：滚动容器 */
const scrollContainer = ref<HTMLElement | Window | null>(null)

/* 响应式状态：元素引用 */
const placeholderRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

/* 派生状态：容器类名 */
const classes = computed(() => ['wt-affix', { 'is-fixed': fixed.value }, props.customClass])

/* 解析滚动容器 */
const resolveContainer = (): HTMLElement | Window | null => {
  if (typeof props.container === 'function') return props.container()
  return props.container ?? window
}

/* 获取当前滚动位置 */
const getScrollTop = () => {
  const container = scrollContainer.value
  if (!container) return 0
  return container === window ? window.scrollY : (container as HTMLElement).scrollTop
}

/* 获取容器顶部位置 */
const getContainerTop = () => {
  const container = scrollContainer.value
  if (!container || container === window) return 0
  return (container as HTMLElement).getBoundingClientRect().top
}

/* 滚动监听 */
const handleScroll = () => {
  if (!placeholderRef.value) return
  const shouldFix = getScrollTop() + getContainerTop() >= props.offset
  if (shouldFix !== fixed.value) {
    fixed.value = shouldFix
    if (shouldFix) {
      placeholderHeight.value = contentRef.value?.offsetHeight ?? 0
    }
    emit('change', shouldFix)
  }
}

const bind = () => {
  scrollContainer.value = resolveContainer()
  if (!scrollContainer.value) return
  scrollContainer.value.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
}

const unbind = () => {
  if (!scrollContainer.value) return
  scrollContainer.value.removeEventListener('scroll', handleScroll)
  scrollContainer.value = null
}

onMounted(bind)
onBeforeUnmount(unbind)

watch(() => props.container, () => {
  unbind()
  bind()
})
</script>

<template>
  <div ref="placeholderRef" class="wt-affix__placeholder" :style="{ height: fixed ? `${placeholderHeight}px` : undefined }">
    <div ref="contentRef" :class="classes" :style="{ top: fixed ? `${offset}px` : undefined }">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wt-affix__placeholder {
  /* 盒模型显示方式 */
  display: block;
}

.wt-affix.is-fixed {
  /* 定位方式 */
  position: fixed;
  /* 层叠层级 */
  z-index: 30;
}
</style>
