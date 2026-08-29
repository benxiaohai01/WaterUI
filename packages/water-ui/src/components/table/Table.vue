<script setup lang="ts">
import { computed } from 'vue'
import type { TableProps } from './props'

defineOptions({ name: 'WtTable' })

const props = withDefaults(defineProps<TableProps>(), {
  bordered: false,
  striped: false,
  size: 'medium',
  emptyText: '暂无数据'
})

const emit = defineEmits<{
  rowClick: [row: Record<string, unknown>, event: MouseEvent]
}>()

const classes = computed(() => [
  'wt-table',
  `wt-table--${props.size}`,
  {
    'is-bordered': props.bordered,
    'is-striped': props.striped
  }
])

const cellValue = (row: Record<string, unknown>, key: string) => row[key] ?? '-'
</script>

<template>
  <div class="wt-table-wrap">
    <span class="wt-table-shape" aria-hidden="true" />
    <table :class="classes">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
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
          :key="rowIndex"
          @click="(event: MouseEvent) => emit('rowClick', row, event)"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :style="{ textAlign: column.align || 'left' }"
          >
            <slot :name="column.key" :row="row" :value="cellValue(row, column.key)">
              {{ cellValue(row, column.key) }}
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
</template>

<style scoped lang="scss">
.wt-table-wrap {
  --wt-highlight-size: clamp(10px, 12%, 18px);
  --wt-highlight-small-size: clamp(6px, 7%, 11px);

  position: relative;
  isolation: isolate;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  border-radius: var(--wt-radius-md);
}

.wt-table-shape {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: color-mix(in srgb, var(--wt-surface) 78%, transparent);
  box-shadow:
    inset 3px 4px 10px rgba(0, 0, 0, 0.08),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 10px 26px rgba(0, 0, 0, 0.06);
  animation: wt-table-edge-flow var(--wt-motion-slow) ease-in-out infinite;
  will-change: border-radius;
}

.wt-table-wrap::after {
  content: '';
  position: absolute;
  width: var(--wt-highlight-size);
  height: var(--wt-highlight-size);
  top: max(var(--wt-highlight-safe-margin), 6px);
  right: max(var(--wt-highlight-safe-margin), 6px);
  background: var(--wt-highlight);
  border-radius: var(--wt-highlight-radius);
  box-shadow: 0 0 10px color-mix(in srgb, var(--wt-primary) 25%, transparent);
  pointer-events: none;
  animation: wt-highlight-float var(--wt-motion-slow) ease-in-out infinite;
  opacity: 0.78;
  z-index: 2;
}

.wt-table-wrap::before {
  content: '';
  position: absolute;
  width: var(--wt-highlight-small-size);
  height: var(--wt-highlight-small-size);
  top: calc(max(var(--wt-highlight-safe-margin), 6px) + var(--wt-highlight-size) + 10px);
  right: calc(max(var(--wt-highlight-safe-margin), 6px) + var(--wt-highlight-size) + 12px);
  background: var(--wt-highlight-small);
  border-radius: var(--wt-highlight-small-radius);
  box-shadow: 0 0 8px color-mix(in srgb, var(--wt-primary) 20%, transparent);
  pointer-events: none;
  animation: wt-highlight-float-small var(--wt-motion-slow) ease-in-out infinite;
  opacity: 0.68;
  z-index: 2;
}

@keyframes wt-table-edge-flow {
  0% {
    border-radius: 28px 18px 30px 22px / 22px 28px 20px 30px;
  }

  50% {
    border-radius: 24px 32px 26px 34px / 34px 24px 32px 26px;
  }

  100% {
    border-radius: 28px 18px 30px 22px / 22px 28px 20px 30px;
  }
}

table {
  position: relative;
  z-index: 1;
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  color: var(--wt-text);
  background: transparent;
}

th,
td {
  padding: 14px 16px;
  border-bottom: 1px solid color-mix(in srgb, var(--wt-text-secondary) 12%, transparent);
  font-size: 14px;
  line-height: 1.5;
}

th {
  color: var(--wt-text-secondary);
  font-weight: 700;
  text-align: left;
  background: color-mix(in srgb, var(--wt-surface-strong) 62%, transparent);
}

tbody tr:last-child td {
  border-bottom: 0;
}

.wt-table--small th,
.wt-table--small td {
  padding: 9px 12px;
  font-size: 12px;
}

.wt-table--large th,
.wt-table--large td {
  padding: 18px 20px;
  font-size: 16px;
}

.wt-table.is-striped tbody tr:nth-child(even) {
  background: color-mix(in srgb, var(--wt-primary) 5%, transparent);
}

.wt-table.is-bordered th,
.wt-table.is-bordered td {
  border-right: 1px solid color-mix(in srgb, var(--wt-text-secondary) 12%, transparent);
}

.wt-table.is-bordered th:last-child,
.wt-table.is-bordered td:last-child {
  border-right: 0;
}

.wt-table__empty {
  text-align: center;
  color: var(--wt-text-placeholder);
}
</style>
