<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from 'vue'
import type { PaginationProps, PaginationEmits } from './props'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtPagination' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<PaginationProps>(), {
  current: 1,
  pageSize: 10,
  pagerCount: 7,
  showTotal: false,
  showJumper: false,
  showSizeChanger: false,
  pageSizes: () => [10, 20, 50, 100],
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<PaginationEmits>()

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 是否由外部显式传入（受控）：受控时以 prop 为准，未传时使用内部状态兜底 */
const vnodeProps = getCurrentInstance()?.vnode.props ?? {}
const isCurrentControlled = 'current' in vnodeProps
const isPageSizeControlled = 'pageSize' in vnodeProps

/* 响应式状态：内部页码 / 每页条数（仅未受控时生效） */
const innerCurrent = ref(props.current)
const innerPageSize = ref(props.pageSize)
/* 响应式状态：跳转输入框 */
const jumperValue = ref('')

/* 派生状态：原始页码（受控时取 prop，未受控时取内部状态） */
const rawCurrent = computed(() => (isCurrentControlled ? props.current : innerCurrent.value))

/* 派生状态：每页条数 */
const pageSizeValue = computed(() => (isPageSizeControlled ? props.pageSize : innerPageSize.value))

/* 派生状态：归一化每页条数（避免 0/负数导致总页数为 Infinity） */
const normalizedPageSize = computed(() => {
  const size = Math.floor(pageSizeValue.value)
  return Number.isFinite(size) && size > 0 ? size : 1
})

/* 派生状态：总页数 */
const pageCount = computed(() => Math.max(1, Math.ceil(props.total / normalizedPageSize.value)))

/* 派生状态：当前页码（始终收敛到 [1, pageCount]，保证列表有激活项） */
const currentPage = computed(() => Math.min(Math.max(1, rawCurrent.value), pageCount.value))

/* 派生状态：每页条数可选项（并入当前值，保证受控值可选中） */
const sizeOptions = computed(() => {
  const values = [...props.pageSizes, normalizedPageSize.value].filter(
    (size) => Number.isFinite(size) && size > 0
  )
  return Array.from(new Set(values)).sort((a, b) => a - b)
})

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

/* 交互处理逻辑：同步页码（未受控时同步内部状态，同时 emit 供 v-model:current 使用） */
const setCurrent = (value: number) => {
  innerCurrent.value = value
  emit('update:current', value)
}

/* 交互处理逻辑：同步每页条数 */
const setPageSize = (value: number) => {
  innerPageSize.value = value
  emit('update:pageSize', value)
  emit('pageSizeChange', value)
}

/* 交互处理逻辑：切换页码 */
const goTo = (page: number) => {
  const target = Math.min(pageCount.value, Math.max(1, page))
  if (target === currentPage.value) return
  setCurrent(target)
  emit('change', target, normalizedPageSize.value)
}

/* 交互处理逻辑：越界纠正（总页数变化或外部传入非法页码时回传合法值） */
watch(
  [rawCurrent, pageCount],
  ([value, total]) => {
    const clamped = Math.min(Math.max(1, value), total)
    if (clamped !== value) setCurrent(clamped)
  },
  { immediate: true }
)

/* 交互处理逻辑：上一页/下一页 */
const prevPage = () => goTo(currentPage.value - 1)
const nextPage = () => goTo(currentPage.value + 1)

/* 交互处理逻辑：切换每页条数（同步纠正越界页码） */
const handleSizeChange = (event: Event) => {
  const value = Number((event.target as HTMLSelectElement).value)
  if (!Number.isFinite(value) || value <= 0) return
  setPageSize(value)
  const nextCount = Math.max(1, Math.ceil(props.total / value))
  if (currentPage.value > nextCount) {
    setCurrent(nextCount)
    emit('change', nextCount, value)
  }
}

/* 交互处理逻辑：快速跳转（仅接受纯数字，非法输入不跳转并清空） */
const handleJumper = () => {
  const value = jumperValue.value.trim()
  if (/^\d+$/.test(value)) goTo(Number(value))
  jumperValue.value = ''
}
</script>

<template>
  <nav :class="['wt-pagination', props.customClass]" :style="highlightStyle" aria-label="分页">
    <span v-if="showTotal" class="wt-pagination__total">共 {{ total }} 条</span>
    <button
      type="button"
      class="wt-pagination__item wt-pagination__prev"
      aria-label="上一页"
      :disabled="currentPage <= 1"
      @click="prevPage"
    >
      ‹
    </button>
    <template v-for="(item, index) in pagerList" :key="`${item}-${index}`">
      <span
        v-if="item === 'prev-more' || item === 'next-more'"
        class="wt-pagination__more"
        aria-hidden="true"
        >…</span
      >
      <button
        v-else
        type="button"
        class="wt-pagination__item"
        :class="{ 'is-active': item === currentPage }"
        :aria-current="item === currentPage ? 'page' : undefined"
        @click="goTo(item)"
      >
        {{ item }}
      </button>
    </template>
    <button
      type="button"
      class="wt-pagination__item wt-pagination__next"
      aria-label="下一页"
      :disabled="currentPage >= pageCount"
      @click="nextPage"
    >
      ›
    </button>
    <select
      v-if="showSizeChanger"
      class="wt-pagination__size"
      :value="normalizedPageSize"
      aria-label="每页条数"
      @change="handleSizeChange"
    >
      <option v-for="size in sizeOptions" :key="size" :value="size">{{ size }} 条/页</option>
    </select>
    <div v-if="showJumper" class="wt-pagination__jumper">
      <span>前往</span>
      <input
        v-model="jumperValue"
        type="text"
        class="wt-pagination__input"
        aria-label="页码"
        @keyup.enter="handleJumper"
      />
      <span>页</span>
    </div>
  </nav>
</template>

<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-pagination {
  /* 高光尺寸（随全局基准等比缩放，6px / 12px）：声明在根元素，便于组件 props 覆盖 */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 0.5);
  /* 次高光尺寸（随全局基准等比缩放，3px / 12px） */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.25);
  /* 高光内边距（随全局偏移等比缩放，3px / 8px） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 0.375);
  /* 主高光定位：右上角 */
  --wt-highlight-top: var(--wt-highlight-inset);
  --wt-highlight-right: var(--wt-highlight-inset);
  /* 次高光定位：右下角，避让居中页码文字 */
  --wt-highlight-small-top: calc(100% - var(--wt-highlight-small-size) - var(--wt-highlight-inset));
  --wt-highlight-small-right: var(--wt-highlight-inset);
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
    border-color var(--wt-motion-fast) ease,
    box-shadow var(--wt-motion-fast) ease,
    color var(--wt-motion-fast) ease;
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
  /* 水滴高光：定位方式 + 独立层叠上下文 + 主/次高光伪元素（层叠层级 2） */
  @include wt.wt-liquid-highlights(2);
  /* 溢出裁剪方式（高光收束在页码块内） */
  overflow: hidden;
  /* 液体形变动画（含 will-change: border-radius） */
  @include wt.wt-liquid-animation(wt-liquid-flow, var(--wt-motion-normal), border-radius);
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

.wt-pagination__size {
  /* 高度 */
  height: 32px;
  /* 内边距 */
  padding: 0 6px;
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
  /* 轮廓 */
  outline: none;
}

.wt-pagination__size:focus {
  /* 边框 */
  border-color: var(--wt-primary);
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
