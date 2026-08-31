<script setup lang="ts">
import { computed, ref } from 'vue'
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

/* 派生状态：容器高度（数字转 px） */
const containerStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}))

/* 派生状态：内容总高度 */
const totalHeight = computed(() => props.data.length * props.itemSize)

/* 派生状态：可视区可容纳的条目数 */
const visibleCount = computed(() => {
  const h = typeof props.height === 'number' ? props.height : 400
  return Math.ceil(h / props.itemSize) + 1
})

/* 派生状态：渲染起始索引（含缓冲） */
const startIndex = computed(() => {
  const raw = Math.floor(scrollTop.value / props.itemSize)
  return Math.max(0, raw - props.buffer)
})

/* 派生状态：渲染结束索引（含缓冲） */
const endIndex = computed(() => {
  const raw = startIndex.value + visibleCount.value + props.buffer * 2
  return Math.min(props.data.length, raw)
})

/* 派生状态：可见切片 */
const visibleData = computed(() => props.data.slice(startIndex.value, endIndex.value))

/* 派生状态：偏移占位高度 */
const offsetTop = computed(() => startIndex.value * props.itemSize)

/* 滚动事件 */
const handleScroll = () => {
  const el = scrollRef.value
  if (!el) return
  scrollTop.value = el.scrollTop
}
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
          :key="startIndex + index"
          class="wt-virtual-list__item"
          :style="{ height: `${itemSize}px` }"
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
