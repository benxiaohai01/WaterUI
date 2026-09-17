<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { VirtualListProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtVirtualList' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<VirtualListProps>(), {
  height: 400,
  buffer: 5,
  customClass: ''
})

/* 滚动容器引用 */
const scrollRef = ref<HTMLElement>()

/* 响应式状态：当前滚动偏移 */
const scrollTop = ref(0)

/* 响应式状态：容器实测高度（height 传 CSS 值时使用） */
const measuredHeight = ref(0)

/* 容器尺寸监听器 */
let resizeObserver: ResizeObserver | undefined

/* 派生状态：容器高度（数字转 px） */
const containerStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}))

/* 派生状态：归一化条目高度（避免 0/负数导致除零） */
const normalizedItemSize = computed(() => {
  const size = Math.floor(props.itemSize)
  return Number.isFinite(size) && size > 0 ? size : 1
})

/* 派生状态：归一化缓冲数量 */
const normalizedBuffer = computed(() => {
  const buffer = Math.floor(props.buffer)
  return Number.isFinite(buffer) && buffer > 0 ? buffer : 0
})

/* 派生状态：可视区高度（数字配置优先，其次取容器实测高度） */
const viewportHeight = computed(() => {
  if (typeof props.height === 'number') return props.height
  return measuredHeight.value || normalizedItemSize.value
})

/* 派生状态：内容总高度 */
const totalHeight = computed(() => props.data.length * normalizedItemSize.value)

/* 派生状态：可视区可容纳的条目数 */
const visibleCount = computed(
  () => Math.ceil(viewportHeight.value / normalizedItemSize.value) + 1
)

/* 派生状态：渲染起始索引（含缓冲，并限制在数据范围内） */
const startIndex = computed(() => {
  const raw = Math.floor(scrollTop.value / normalizedItemSize.value)
  const maxStart = Math.max(0, props.data.length - visibleCount.value)
  return Math.min(Math.max(0, raw - normalizedBuffer.value), maxStart)
})

/* 派生状态：渲染结束索引（含缓冲） */
const endIndex = computed(() => {
  const raw = startIndex.value + visibleCount.value + normalizedBuffer.value * 2
  return Math.min(props.data.length, raw)
})

/* 派生状态：可见切片 */
const visibleData = computed(() => props.data.slice(startIndex.value, endIndex.value))

/* 派生状态：偏移占位高度 */
const offsetTop = computed(() => startIndex.value * normalizedItemSize.value)

/* 交互处理逻辑：生成列表项 key（未配置 itemKey 时回退全局索引） */
const resolveItemKey = (item: unknown, index: number): string | number => {
  const key = props.itemKey
  if (typeof key === 'function') return key(item, index)
  if (typeof key === 'string' && item !== null && typeof item === 'object' && key in item) {
    return (item as Record<string, unknown>)[key] as string | number
  }
  return startIndex.value + index
}

/* 滚动事件 */
const handleScroll = () => {
  const el = scrollRef.value
  if (!el) return
  scrollTop.value = el.scrollTop
}

/* 交互处理逻辑：测量容器可视高度 */
const measure = () => {
  const el = scrollRef.value
  if (el) measuredHeight.value = el.clientHeight
}

onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(measure)
    if (scrollRef.value) resizeObserver.observe(scrollRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = undefined
})
</script>

<template>
  <div
    ref="scrollRef"
    class="wt-virtual-list"
    :class="props.customClass"
    :style="containerStyle"
    @scroll="handleScroll"
  >
    <div class="wt-virtual-list__phantom" :style="{ height: `${totalHeight}px` }">
      <div
        class="wt-virtual-list__offset"
        :style="{ transform: `translateY(${offsetTop}px)` }"
      >
        <div
          v-for="(item, index) in visibleData"
          :key="resolveItemKey(item, index)"
          class="wt-virtual-list__item"
          :style="{ height: `${normalizedItemSize}px` }"
        >
          <slot :item="item" :index="startIndex + index" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wt-virtual-list {
  /* 宽度 */
  width: 100%;
  /* 溢出滚动 */
  overflow-y: auto;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 45%, transparent);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.04),
    inset -1px -1px 4px var(--wt-shadow-light);
  /* 滚动条样式 */
  scrollbar-width: thin;
  /* 滚动条样式 */
  scrollbar-color: color-mix(in srgb, var(--wt-text-secondary) 35%, transparent) transparent;
}

.wt-virtual-list__phantom {
  /* 定位方式 */
  position: relative;
  /* 宽度 */
  width: 100%;
}

.wt-virtual-list__offset {
  /* 宽度 */
  width: 100%;
}

.wt-virtual-list__item {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 宽度 */
  width: 100%;
  /* 盒模型 */
  box-sizing: border-box;
}
</style>
