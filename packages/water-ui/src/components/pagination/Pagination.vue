<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { PaginationProps, PaginationEmits } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtPagination' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<PaginationProps>(), {
  current: 1,
  pageSize: 10,
  pagerCount: 7,
  showTotal: false,
  showJumper: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<PaginationEmits>()

/* 响应式状态：当前页码（受控） */
const currentPage = ref(props.current)
/* 响应式状态：跳转输入框 */
const jumperValue = ref('')

/* 同步外部 current 变化 */
watch(
  () => props.current,
  (value) => {
    currentPage.value = value
  }
)

/* 派生状态：总页数 */
const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

/* 派生状态：可见页码列表（带省略号逻辑） */
const pagerList = computed<Array<number | 'prev-more' | 'next-more'>>(() => {
  const count = props.pagerCount
  const total = pageCount.value
  const current = currentPage.value
  if (total <= count) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const half = Math.floor(count / 2)
  let start = Math.max(1, current - half)
  const end = Math.min(total, start + count - 1)
  start = Math.max(1, end - count + 1)
  const list: Array<number | 'prev-more' | 'next-more'> = []
  if (start > 1) {
    list.push(1)
    if (start > 2) list.push('prev-more')
  }
  for (let i = start; i <= end; i += 1) list.push(i)
  if (end < total) {
    if (end < total - 1) list.push('next-more')
    list.push(total)
  }
  return list
})

/* 交互处理逻辑：切换页码 */
const goTo = (page: number) => {
  const target = Math.min(pageCount.value, Math.max(1, page))
  if (target === currentPage.value) return
  currentPage.value = target
  emit('change', target, props.pageSize)
}

/* 交互处理逻辑：上一页/下一页 */
const prevPage = () => goTo(currentPage.value - 1)
const nextPage = () => goTo(currentPage.value + 1)

/* 交互处理逻辑：快速跳转 */
const handleJumper = () => {
  const value = Number.parseInt(jumperValue.value, 10)
  if (!Number.isNaN(value)) goTo(value)
  jumperValue.value = ''
}
</script>

<template>
  <nav :class="['wt-pagination', props.customClass]" aria-label="分页">
    <span v-if="showTotal" class="wt-pagination__total">共 {{ total }} 条</span>
    <button
      type="button"
      class="wt-pagination__item wt-pagination__prev"
      :disabled="currentPage <= 1"
      @click="prevPage"
    >
      ‹
    </button>
    <template v-for="(item, index) in pagerList" :key="`${item}-${index}`">
      <span v-if="item === 'prev-more' || item === 'next-more'" class="wt-pagination__more">…</span>
      <button
        v-else
        type="button"
        class="wt-pagination__item"
        :class="{ 'is-active': item === currentPage }"
        @click="goTo(item)"
      >
        {{ item }}
      </button>
    </template>
    <button
      type="button"
      class="wt-pagination__item wt-pagination__next"
      :disabled="currentPage >= pageCount"
      @click="nextPage"
    >
      ›
    </button>
    <div v-if="showJumper" class="wt-pagination__jumper">
      <span>前往</span>
      <input
        v-model="jumperValue"
        type="text"
        class="wt-pagination__input"
        @keyup.enter="handleJumper"
      />
      <span>页</span>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.wt-pagination {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 间隙 */
  gap: var(--wt-space-xs);
  /* 换行 */
  flex-wrap: wrap;
}

.wt-pagination__total {
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 13px;
  /* 右侧外边距 */
  margin-right: var(--wt-space-xs);
}

.wt-pagination__item {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴对齐方式 */
  justify-content: center;
  /* 最小宽度 */
  min-width: 32px;
  /* 高度 */
  height: 32px;
  /* 内边距 */
  padding: 0 8px;
  /* 边框 */
  border: 1px solid color-mix(in srgb, var(--wt-text-secondary) 16%, transparent);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 72%, transparent);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-xs);
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 13px;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 过渡 */
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease;
}

.wt-pagination__item:hover:not(:disabled) {
  /* 边框 */
  border-color: var(--wt-primary);
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-pagination__item:disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.45;
}

.wt-pagination__item.is-active {
  /* 边框 */
  border-color: var(--wt-primary);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 14%, transparent);
  /* 文本颜色 */
  color: var(--wt-primary);
  /* 字重 */
  font-weight: 600;
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.06),
    inset -1px -1px 4px var(--wt-shadow-light),
    0 4px 12px color-mix(in srgb, var(--wt-primary) 22%, transparent);
}

.wt-pagination__more {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 字号 */
  font-size: 13px;
  /* 内边距 */
  padding: 0 2px;
}

.wt-pagination__jumper {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 间隙 */
  gap: 4px;
  /* 左侧外边距 */
  margin-left: var(--wt-space-xs);
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 13px;
}

.wt-pagination__input {
  /* 宽度 */
  width: 44px;
  /* 高度 */
  height: 30px;
  /* 文本对齐方式 */
  text-align: center;
  /* 边框 */
  border: 1px solid color-mix(in srgb, var(--wt-text-secondary) 16%, transparent);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 72%, transparent);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-xs);
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 13px;
  /* 轮廓 */
  outline: none;
}

.wt-pagination__input:focus {
  /* 边框 */
  border-color: var(--wt-primary);
}
</style>
