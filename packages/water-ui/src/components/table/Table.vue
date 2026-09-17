<script setup lang="ts">
import { computed } from 'vue'
import type { TableProps } from './props'
import { resolveSize } from '../config-provider/context'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtTable' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<TableProps>(), {
  bordered: false,
  striped: false,
  emptyText: '暂无数据'
})

/* 声明组件事件 */
const emit = defineEmits<{
  rowClick: [row: Record<string, unknown>, event: MouseEvent]
}>()

/* 解析组件尺寸配置 */
const size = resolveSize(() => props.size)

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-table',
  `wt-table--${size.value}`,
  {
    'is-bordered': props.bordered,
    'is-striped': props.striped
  }
])

/* 交互处理逻辑：行唯一键（未配置 rowKey 时回退行索引） */
const resolveRowKey = (row: Record<string, unknown>, index: number): string | number => {
  const key = props.rowKey
  if (typeof key === 'function') return key(row)
  if (typeof key === 'string') {
    const value = row[key]
    if (value !== null && value !== undefined) return value as string | number
  }
  return index
}

/* 交互处理逻辑：单元格原始值（插槽使用，保留 null/undefined） */
const rawValue = (row: Record<string, unknown>, key: string) => row[key]

/* 交互处理逻辑：默认渲染文本（空值替换为占位符） */
const displayValue = (row: Record<string, unknown>, key: string) => row[key] ?? '-'
</script>

<template>
  <div class="wt-table-container" :style="highlightStyle">
    <span class="wt-table-shape" aria-hidden="true" />
    <div class="wt-table-wrap">
      <table :class="classes">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :style="{
                width: column.width,
                textAlign: column.align || 'left'
              }"
            >
              {{ column.title }}
            </th>
          </tr>
        </thead>
        <tbody v-if="data.length">
          <tr
            v-for="(row, rowIndex) in data"
            :key="resolveRowKey(row, rowIndex)"
            @click="(event: MouseEvent) => emit('rowClick', row, event)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :style="{ textAlign: column.align || 'left' }"
            >
              <slot :name="column.key" :row="row" :value="rawValue(row, column.key)">
                {{ displayValue(row, column.key) }}
              </slot>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="columns.length" class="wt-table__empty">{{ emptyText }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-table-container {
  /* 定位方式：高光与背景板相对滚动外层定位，横向滚动时不跟随移动 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 溢出裁剪 */
  overflow: hidden;
  /* 宽度 */
  width: 100%;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
}

.wt-table-wrap {
  /* 定位方式 */
  position: relative;
  /* 层叠层级 */
  z-index: 1;
  /* 水平方向溢出裁剪 */
  overflow-x: auto;
  /* 垂直方向溢出裁剪 */
  overflow-y: hidden;
  /* 宽度 */
  width: 100%;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
}

.wt-table-shape {
  /* 定位方式 */
  position: absolute;
  /* 上下左右偏移合成属性 */
  inset: 0;
  /* 层叠层级 */
  z-index: 0;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 78%, transparent);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 10px rgba(0, 0, 0, 0.08),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 10px 26px rgba(0, 0, 0, 0.06);
  /* 液体形变动画（自定义动画名 wt-table-edge-flow，含 will-change: border-radius） */
  @include wt.wt-liquid-animation(wt-table-edge-flow, var(--wt-motion-slow), border-radius);
}

.wt-table-container::after {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 宽度 */
  width: var(--wt-highlight-size);
  /* 高度 */
  height: var(--wt-highlight-size);
  /* 顶部偏移 */
  top: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px));
  /* 右侧偏移 */
  right: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px));
  /* 背景 */
  background: var(--wt-highlight);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-radius);
  /* 水滴内外部阴影层次 */
  box-shadow: 0 0 10px color-mix(in srgb, var(--wt-primary) 25%, transparent);
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 动画 */
  animation: wt-highlight-float var(--wt-motion-slow) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-opacity);
  /* 层叠层级 */
  z-index: 2;
}

.wt-table-container::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 宽度 */
  width: var(--wt-highlight-small-size);
  /* 高度 */
  height: var(--wt-highlight-small-size);
  /* 顶部偏移 */
  top: min(calc(var(--wt-highlight-inset) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 4px));
  /* 右侧偏移 */
  right: min(calc(var(--wt-highlight-inset) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 4px));
  /* 背景 */
  background: var(--wt-highlight-small);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-small-radius);
  /* 水滴内外部阴影层次 */
  box-shadow: 0 0 8px color-mix(in srgb, var(--wt-primary) 20%, transparent);
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 动画 */
  animation: wt-highlight-float-small var(--wt-motion-slow) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-small-opacity);
  /* 层叠层级 */
  z-index: 2;
}

@keyframes wt-table-edge-flow {
  0% {
    /* 圆角，塑造水滴/液体轮廓 */
    border-radius: 28px 18px 30px 22px / 22px 28px 20px 30px;
  }

  50% {
    /* 圆角，塑造水滴/液体轮廓 */
    border-radius: 24px 32px 26px 34px / 34px 24px 32px 26px;
  }

  100% {
    /* 圆角，塑造水滴/液体轮廓 */
    border-radius: 28px 18px 30px 22px / 22px 28px 20px 30px;
  }
}

table {
  /* 定位方式 */
  position: relative;
  /* 层叠层级 */
  z-index: 1;
  /* 宽度 */
  width: 100%;
  /* 最小宽度 */
  min-width: 640px;
  /* 表格边框合并方式 */
  border-collapse: collapse;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 背景 */
  background: transparent;
}

th,
td {
  /* 内边距 */
  padding: 14px 16px;
  /* 底部边框 */
  border-bottom: 1px solid color-mix(in srgb, var(--wt-text-secondary) 12%, transparent);
  /* 字号 */
  font-size: 14px;
  /* 行高 */
  line-height: 1.5;
}

th {
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字重 */
  font-weight: 700;
  /* 文本对齐方式 */
  text-align: left;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface-strong) 62%, transparent);
}

tbody tr:last-child td {
  /* 底部边框 */
  border-bottom: 0;
}

.wt-table--small th,
.wt-table--small td {
  /* 内边距 */
  padding: 9px 12px;
  /* 字号 */
  font-size: 12px;
}

.wt-table--large th,
.wt-table--large td {
  /* 内边距 */
  padding: 18px 20px;
  /* 字号 */
  font-size: 16px;
}

.wt-table.is-striped tbody tr:nth-child(even) {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 5%, transparent);
}

.wt-table.is-bordered th,
.wt-table.is-bordered td {
  /* 右侧边框 */
  border-right: 1px solid color-mix(in srgb, var(--wt-text-secondary) 12%, transparent);
}

.wt-table.is-bordered th:last-child,
.wt-table.is-bordered td:last-child {
  /* 右侧边框 */
  border-right: 0;
}

.wt-table__empty {
  /* 文本对齐方式 */
  text-align: center;
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
}
</style>