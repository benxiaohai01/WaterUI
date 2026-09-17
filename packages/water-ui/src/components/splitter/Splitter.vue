<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import type { SplitterProps } from './props'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtSplitter' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<SplitterProps>(), {
  direction: 'horizontal',
  modelValue: 260,
  min: 80,
  max: 800,
  step: 8,
  barSize: 8,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [size: number]
  change: [size: number]
}>()

/* 容器引用 */
const containerRef = ref<HTMLElement>()

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 响应式状态：是否正在拖拽 */
const dragging = ref(false)

/* 拖拽起始信息 */
let startClient = 0
let startSize = 0
let startContainer = 0
/* 拖拽过程中的最新尺寸（结束时统一 emit change） */
let dragSize = 0
/* 拖拽前的 body 用户选择样式（用于还原） */
let originalUserSelect = ''

/* 派生状态：容器类名 */
const classes = computed(() => [
  'wt-splitter',
  `wt-splitter--${props.direction}`,
  { 'is-dragging': dragging.value },
  props.customClass
])

/* 派生状态：分隔条类名 */
const barClasses = computed(() => [
  'wt-splitter__bar',
  `wt-splitter__bar--${props.direction}`
])

/* 派生状态：第一面板尺寸样式 */
const panelStyle = computed(() => {
  const size = Math.min(Math.max(props.modelValue, props.min), props.max)
  return props.direction === 'horizontal'
    ? { width: `${size}px` }
    : { height: `${size}px` }
})

/* 交互处理逻辑：面板尺寸上界（同时受容器尺寸、max 约束，且不小于 min） */
const resolveUpperBound = (containerSize: number) =>
  Math.max(props.min, Math.min(containerSize - props.min, props.max))

/* 交互处理逻辑：把尺寸收敛到 [min, upper] 区间 */
const clampSize = (size: number, containerSize: number) =>
  Math.min(Math.max(size, props.min), resolveUpperBound(containerSize))

/* 拖拽开始 */
const handleBarDown = (event: MouseEvent) => {
  event.preventDefault()
  const el = containerRef.value
  if (!el) return
  dragging.value = true
  startClient = props.direction === 'horizontal' ? event.clientX : event.clientY
  startSize = Math.min(Math.max(props.modelValue, props.min), props.max)
  startContainer =
    props.direction === 'horizontal' ? el.clientWidth : el.clientHeight
  dragSize = startSize
  window.addEventListener('mousemove', handleBarMove)
  window.addEventListener('mouseup', handleBarUp)
  originalUserSelect = document.body.style.userSelect
  document.body.style.userSelect = 'none'
}

/* 拖拽移动（高频更新只走 update:modelValue） */
const handleBarMove = (event: MouseEvent) => {
  if (!dragging.value) return
  const delta = (props.direction === 'horizontal' ? event.clientX : event.clientY) - startClient
  const next = clampSize(startSize + delta, startContainer)
  dragSize = next
  emit('update:modelValue', next)
}

/* 拖拽结束（一次性上报最终值） */
const handleBarUp = () => {
  if (!dragging.value) return
  dragging.value = false
  window.removeEventListener('mousemove', handleBarMove)
  window.removeEventListener('mouseup', handleBarUp)
  document.body.style.userSelect = originalUserSelect
  if (dragSize !== startSize) emit('change', dragSize)
}

/* 交互处理逻辑：键盘调整尺寸（水平方向左右键 / 垂直方向上下键） */
const handleBarKeydown = (event: KeyboardEvent) => {
  const horizontal = props.direction === 'horizontal'
  const decreaseKey = horizontal ? 'ArrowLeft' : 'ArrowUp'
  const increaseKey = horizontal ? 'ArrowRight' : 'ArrowDown'
  if (event.key !== decreaseKey && event.key !== increaseKey) return
  event.preventDefault()
  const el = containerRef.value
  if (!el) return
  const containerSize = horizontal ? el.clientWidth : el.clientHeight
  const current = clampSize(props.modelValue, containerSize)
  const delta = event.key === increaseKey ? props.step : -props.step
  const next = clampSize(current + delta, containerSize)
  if (next === current) return
  emit('update:modelValue', next)
  emit('change', next)
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleBarMove)
  window.removeEventListener('mouseup', handleBarUp)
  /* 拖拽中卸载时同样还原 body 用户选择样式，避免全局锁死 */
  if (dragging.value) {
    dragging.value = false
    document.body.style.userSelect = originalUserSelect
  }
})
</script>

<template>
  <div ref="containerRef" :class="classes" :style="highlightStyle">
    <div class="wt-splitter__pane wt-splitter__pane--first" :style="panelStyle">
      <slot name="first" />
    </div>
    <div
      :class="barClasses"
      :style="{
        [direction === 'horizontal' ? 'width' : 'height']: `${barSize}px`,
        cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize'
      }"
      role="separator"
      :aria-orientation="direction === 'horizontal' ? 'vertical' : 'horizontal'"
      :aria-valuenow="Math.min(Math.max(modelValue, min), max)"
      :aria-valuemin="min"
      :aria-valuemax="max"
      tabindex="0"
      @mousedown="handleBarDown"
      @keydown="handleBarKeydown"
    >
      <span class="wt-splitter__bar-dot" aria-hidden="true" />
    </div>
    <div class="wt-splitter__pane wt-splitter__pane--second">
      <slot name="second" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wt-splitter {
  /* 盒模型显示方式 */
  display: flex;
  /* 宽度 */
  width: 100%;
  /* 高度 */
  height: 100%;
  /* 溢出裁剪 */
  overflow: hidden;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 55%, transparent);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.06),
    inset -1px -1px 4px var(--wt-shadow-light),
    0 8px 20px rgba(0, 0, 0, 0.05);
}

.wt-splitter--vertical {
  /* 排列方向 */
  flex-direction: column;
}

.wt-splitter__pane {
  /* 弹性布局中的伸缩比例 */
  flex: 1;
  /* 最小宽度 */
  min-width: 0;
  /* 溢出滚动 */
  overflow: auto;
  /* 内边距 */
  padding: 16px;
}

.wt-splitter__pane--first {
  /* 弹性收缩 */
  flex-shrink: 0;
}

.wt-splitter__bar {
  /* 弹性收缩 */
  flex-shrink: 0;
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: flex;
  /* 主轴对齐方式 */
  justify-content: center;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-text-secondary) 10%, transparent);
  /* 过渡 */
  transition: background var(--wt-motion-fast) ease;
  /* 触摸操作 */
  touch-action: none;
}

.wt-splitter__bar:hover,
.wt-splitter.is-dragging .wt-splitter__bar {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 28%, transparent);
}

.wt-splitter__bar-dot {
  /* 宽度 */
  width: 4px;
  /* 高度 */
  height: 28px;
  /* 圆角 */
  border-radius: 999px;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-text-secondary) 35%, transparent);
  /* 水滴内外部阴影层次 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  /* 过渡 */
  transition: background var(--wt-motion-fast) ease;
}

.wt-splitter--vertical .wt-splitter__bar-dot {
  /* 宽度 */
  width: 28px;
  /* 高度 */
  height: 4px;
}

.wt-splitter__bar:hover .wt-splitter__bar-dot,
.wt-splitter.is-dragging .wt-splitter__bar-dot {
  /* 背景 */
  background: var(--wt-primary);
}
</style>
