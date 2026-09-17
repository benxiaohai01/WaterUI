<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { ScrollbarProps } from './props'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtScrollbar' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<ScrollbarProps>(), {
  alwaysShow: false,
  minThumbSize: 24,
  customClass: ''
})

/* 组件实例引用 */
const wrapRef = ref<HTMLElement>()
const thumbRef = ref<HTMLElement>()

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 响应式状态：轨道可见性与滑块偏移 */
const trackVisible = ref(false)
const thumbHeight = ref(0)
const thumbTop = ref(0)

/* 派生状态：容器样式 */
const wrapStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.height !== undefined) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  if (props.maxHeight !== undefined) {
    style.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  }
  return style
})

/* 滑块高度：按内容比例计算，且不小于最小长度 */const calcThumb = () => {
  const el = wrapRef.value
  if (!el) return
  const { clientHeight, scrollHeight, scrollTop } = el
  const maxScroll = scrollHeight - clientHeight
  if (maxScroll <= 0) {
    trackVisible.value = false
    return
  }
  const ratio = clientHeight / scrollHeight
  thumbHeight.value = Math.max(clientHeight * ratio, props.minThumbSize)
  const maxTop = Math.max(clientHeight - thumbHeight.value, 0)
  thumbTop.value = maxTop > 0 ? (scrollTop / maxScroll) * maxTop : 0
  trackVisible.value = true
}

/* 滚动事件：更新滑块位置 */
const handleScroll = () => {
  const el = wrapRef.value
  if (!el) return
  const { clientHeight, scrollHeight, scrollTop } = el
  const maxScroll = scrollHeight - clientHeight
  if (maxScroll <= 0) return
  const maxTop = Math.max(clientHeight - thumbHeight.value, 0)
  thumbTop.value = maxTop > 0 ? (scrollTop / maxScroll) * maxTop : 0
}

/* 滑块拖拽 */
const dragging = ref(false)
let dragStartY = 0
let dragStartTop = 0

const handleThumbDown = (event: MouseEvent) => {
  event.preventDefault()
  dragging.value = true
  dragStartY = event.clientY
  dragStartTop = thumbTop.value
  window.addEventListener('mousemove', handleThumbMove)
  window.addEventListener('mouseup', handleThumbUp)
}

const handleThumbMove = (event: MouseEvent) => {
  const el = wrapRef.value
  if (!el || !dragging.value) return
  const { clientHeight, scrollHeight } = el
  const maxScroll = scrollHeight - clientHeight
  const maxTop = Math.max(clientHeight - thumbHeight.value, 0)
  if (maxTop <= 0) return
  /* 鼠标位移与滑块位移 1:1，再按比例映射回滚动距离 */
  const nextTop = Math.min(Math.max(dragStartTop + (event.clientY - dragStartY), 0), maxTop)
  el.scrollTop = (nextTop / maxTop) * maxScroll
}

const handleThumbUp = () => {
  dragging.value = false
  window.removeEventListener('mousemove', handleThumbMove)
  window.removeEventListener('mouseup', handleThumbUp)
}

/* 内容尺寸变化时重算滑块 */
let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  calcThumb()
  const el = wrapRef.value
  if (el) {
    el.addEventListener('scroll', handleScroll)
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => calcThumb())
      resizeObserver.observe(el)
      const content = el.firstElementChild
      if (content) resizeObserver.observe(content)
    }
  }
  window.addEventListener('resize', calcThumb)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', calcThumb)
  window.removeEventListener('mousemove', handleThumbMove)
  window.removeEventListener('mouseup', handleThumbUp)
  resizeObserver?.disconnect()
  resizeObserver = undefined
  const el = wrapRef.value
  if (el) {
    el.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div
    class="wt-scrollbar"
    :class="[props.customClass, { 'is-dragging': dragging }]"
    :style="highlightStyle"
  >
    <div ref="wrapRef" class="wt-scrollbar__wrap" :style="wrapStyle">
      <div class="wt-scrollbar__content">
        <slot />
      </div>
    </div>
    <div
      v-if="trackVisible || alwaysShow"
      class="wt-scrollbar__track"
      :class="{ 'is-visible': trackVisible || alwaysShow }"
    >
      <div
        ref="thumbRef"
        class="wt-scrollbar__thumb"
        :style="{ height: `${thumbHeight}px`, transform: `translateY(${thumbTop}px)` }"
        @mousedown="handleThumbDown"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wt-scrollbar {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: flex;
  /* 溢出裁剪 */
  overflow: hidden;
}

.wt-scrollbar__wrap {
  /* 弹性布局中的伸缩比例 */
  flex: 1;
  /* 溢出滚动 */
  overflow-y: auto;
  /* 溢出裁剪 */
  overflow-x: hidden;
  /* 滚动条样式 */
  scrollbar-width: none;
  /* 滚动条样式 */
  -ms-overflow-style: none;
}

.wt-scrollbar__wrap::-webkit-scrollbar {
  /* 宽度 */
  width: 0;
  /* 高度 */
  height: 0;
}

.wt-scrollbar__content {
  /* 内边距 */
  padding-right: 8px;
}

.wt-scrollbar__track {
  /* 宽度 */
  width: 8px;
  /* 定位方式 */
  position: absolute;
  /* 顶部偏移 */
  top: 2px;
  /* 底部偏移 */
  bottom: 2px;
  /* 右侧偏移 */
  right: 2px;
  /* 圆角 */
  border-radius: 999px;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-text-secondary) 8%, transparent);
  /* 透明度 */
  opacity: 0;
  /* 过渡 */
  transition: opacity var(--wt-motion-fast) ease;
}

.wt-scrollbar__track.is-visible,
.wt-scrollbar:hover .wt-scrollbar__track {
  /* 透明度 */
  opacity: 1;
}

.wt-scrollbar__thumb {
  /* 宽度 */
  width: 100%;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 999px;
  /* 背景 */
  background: linear-gradient(
    145deg,
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha)),
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha-strong))
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 1px 1px 3px rgba(0, 0, 0, 0.15),
    1px 2px 4px rgba(0, 0, 0, 0.08);
  /* 鼠标指针样式 */
  cursor: grab;
  /* 过渡 */
  transition: background var(--wt-motion-fast) ease;
}

.wt-scrollbar__thumb:hover {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 55%, transparent);
}

.wt-scrollbar.is-dragging .wt-scrollbar__thumb {
  /* 鼠标指针样式 */
  cursor: grabbing;
  /* 背景 */
  background: var(--wt-primary);
}
</style>
