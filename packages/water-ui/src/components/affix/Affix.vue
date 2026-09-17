<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { AffixProps } from './props'
import { useHighlightStyle } from '../../utils/highlight'

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

/* 响应式状态：固定时相对视口的顶部偏移 */
const fixedTop = ref(0)

/* 响应式状态：占位高度 */
const placeholderHeight = ref(0)

/* 响应式状态：固定时的宽度（同步占位宽度，避免固定后宽度塌缩） */
const fixedWidth = ref(0)

/* 响应式状态：滚动容器 */
const scrollContainer = ref<HTMLElement | Window | null>(null)

/* 响应式状态：元素引用 */
const placeholderRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 派生状态：容器类名 */
const classes = computed(() => ['wt-affix', { 'is-fixed': fixed.value }, props.customClass])

/* 派生状态：固定时的定位与宽度（宽度取自占位元素，保持原有布局尺寸） */
const fixedStyle = computed(() =>
  fixed.value ? { top: `${fixedTop.value}px`, width: `${fixedWidth.value}px` } : undefined
)

/* 解析滚动容器 */
const resolveContainer = (): HTMLElement | Window | null => {
  if (typeof props.container === 'function') return props.container()
  return props.container ?? window
}

/* 滚动监听：以占位元素的实际位置判定是否吸顶 */
const handleScroll = () => {
  const placeholder = placeholderRef.value
  if (!placeholder) return
  const container = scrollContainer.value
  const isWindow = !container || container === window
  const rect = placeholder.getBoundingClientRect()
  const contentHeight = contentRef.value?.offsetHeight ?? placeholderHeight.value
  const offset = props.offset

  let shouldFix: boolean
  let top = offset

  if (isWindow) {
    /* 窗口滚动：占位元素顶边越过视口偏移线即吸附 */
    shouldFix = rect.top <= offset
  } else {
    const containerRect = (container as HTMLElement).getBoundingClientRect()
    /* 容器滚动：元素在容器内滚过偏移线后吸附，容器底部越过元素时被顶走 */
    const passed = rect.top - containerRect.top <= offset
    const maxTop = containerRect.bottom - contentHeight
    shouldFix = passed && maxTop >= offset
    top = Math.min(Math.max(containerRect.top, 0) + offset, Math.max(maxTop, offset))
  }

  fixedTop.value = top

  if (shouldFix !== fixed.value) {
    fixed.value = shouldFix
    if (shouldFix) {
      placeholderHeight.value = contentRef.value?.offsetHeight ?? 0
      /* 固定前记录占位宽度，固定后内容脱离文档流也不会塌缩 */
      fixedWidth.value = placeholder.offsetWidth
    }
    emit('change', shouldFix)
  } else if (shouldFix) {
    /* 固定期间窗口尺寸变化时重新同步宽度 */
    if (placeholder.offsetWidth !== fixedWidth.value) fixedWidth.value = placeholder.offsetWidth
  }
}

const bind = (retried = false) => {
  scrollContainer.value = resolveContainer()
  if (!scrollContainer.value) {
    /* 容器函数可能在挂载时尚未就绪，下一帧重试一次 */
    if (!retried) nextTick(() => bind(true))
    return
  }
  scrollContainer.value.addEventListener('scroll', handleScroll, { passive: true })
  /* 自定义容器时页面滚动同样会移动容器，需要一并重算固定位置 */
  if (scrollContainer.value !== window) {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
  handleScroll()
}

const unbind = () => {
  if (!scrollContainer.value) return
  scrollContainer.value.removeEventListener('scroll', handleScroll)
  if (scrollContainer.value !== window) {
    window.removeEventListener('scroll', handleScroll)
  }
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
    <div ref="contentRef" :class="classes" :style="[fixedStyle, highlightStyle]">
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
  /* 背景：与页面同色，固定时遮盖下方滚动内容，不再透出文字 */
  background: var(--wt-bg);
}
</style>
