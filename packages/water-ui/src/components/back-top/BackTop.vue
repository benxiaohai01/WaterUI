<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { BackTopProps } from './props'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtBackTop' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<BackTopProps>(), {
  visibilityHeight: 200,
  container: undefined,
  duration: 300,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

/* 响应式状态：是否显示 */
const visible = ref(false)

/* 响应式状态：滚动容器 */
const scrollContainer = ref<HTMLElement | Window | null>(null)

/* 动画帧句柄：用于取消进行中的滚动动画 */
let rafId: number | null = null

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 派生状态：容器类名 */
const classes = computed(() => [
  'wt-back-top',
  { 'is-visible': visible.value },
  props.customClass
])

/* 解析滚动容器 */
const resolveContainer = (): HTMLElement | Window | null => {
  if (typeof props.container === 'function') return props.container()
  return props.container ?? window
}

/* 获取滚动高度 */
const getScrollTop = () => {
  const container = scrollContainer.value
  if (!container) return 0
  return container === window ? window.scrollY : (container as HTMLElement).scrollTop
}

/* 滚动监听 */
const handleScroll = () => {
  const shouldShow = getScrollTop() >= props.visibilityHeight
  if (shouldShow !== visible.value) visible.value = shouldShow
}

/* 取消进行中的滚动动画 */
const cancelScroll = () => {
  if (rafId === null) return
  cancelAnimationFrame(rafId)
  rafId = null
}

/* 平滑滚动到顶部 */
const scrollToTop = () => {
  const container = scrollContainer.value ?? window
  const start = getScrollTop()
  if (start <= 0) return
  cancelScroll()
  const startTime = performance.now()

  const step = (now: number) => {
    const progress = Math.min((now - startTime) / props.duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    const top = start * (1 - ease)
    if (container === window) {
      window.scrollTo(0, top)
    } else {
      ;(container as HTMLElement).scrollTop = top
    }
    if (progress < 1) {
      rafId = requestAnimationFrame(step)
    } else {
      rafId = null
    }
  }

  rafId = requestAnimationFrame(step)
}

/* 交互处理逻辑：点击 */
const handleClick = (event: MouseEvent) => {
  emit('click', event)
  scrollToTop()
}

const bind = () => {
  scrollContainer.value = resolveContainer()
  if (!scrollContainer.value) return
  scrollContainer.value.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
}

const unbind = () => {
  /* 卸载或切换容器时终止动画，避免继续写入 scrollTop */
  cancelScroll()
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
  <transition name="wt-back-top">
    <button
      v-show="visible"
      :class="classes"
      :style="highlightStyle"
      type="button"
      aria-label="返回顶部"
      @click="handleClick"
    >
      <slot>
        <span class="wt-back-top__arrow" aria-hidden="true">↑</span>
      </slot>
    </button>
  </transition>
</template>

<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-back-top {
  /* 水滴高光：固定定位 + 独立层叠上下文 + 主/次高光伪元素（层叠层级 2） */
  @include wt.wt-liquid-highlights(2, fixed);
  /* 水滴流动动画：圆角微变形 */
  @include wt.wt-liquid-animation(wt-liquid-flow, var(--wt-motion-normal), border-radius);
  /* 右侧偏移 */
  right: 32px;
  /* 底部偏移 */
  bottom: 32px;
  /* 宽度 */
  width: 44px;
  /* 高度 */
  height: 44px;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
  /* 边框 */
  border: 0;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wt-surface) 94%, transparent),
    color-mix(in srgb, var(--wt-bg) 92%, var(--wt-surface))
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(255, 255, 255, 0.15),
    inset -2px -2px 6px var(--wt-shadow-light),
    4px 6px 18px rgba(0, 0, 0, 0.18);
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 层叠层级 */
  z-index: 50;
  /* 过渡动画 */
  transition:
    transform var(--wt-motion-fast) ease,
    box-shadow var(--wt-motion-fast) ease,
    color var(--wt-motion-fast) ease;
}

.wt-back-top:hover {
  /* 形变 */
  transform: translateY(-3px) scale(1.06);
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-back-top:active {
  /* 形变 */
  transform: scale(0.92);
}

.wt-back-top__arrow {
  /* 字号 */
  font-size: 20px;
  /* 行高 */
  line-height: 1;
}

/* 显示/隐藏过渡动画 */
.wt-back-top-enter-active,
.wt-back-top-leave-active {
  /* 过渡动画 */
  transition:
    opacity var(--wt-motion-fast) ease,
    transform var(--wt-motion-fast) ease;
}

.wt-back-top-enter-from,
.wt-back-top-leave-to {
  /* 透明度 */
  opacity: 0;
  /* 形变 */
  transform: translateY(10px) scale(0.9);
}
</style>
