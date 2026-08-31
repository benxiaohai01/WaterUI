<script setup lang="ts">
import { computed } from 'vue'
import type { DescriptionsItemProps } from './props'
import { useDescriptions } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtDescriptionsItem' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<DescriptionsItemProps>(), {
  label: '',
  span: 1,
  customClass: ''
})

/* 注入父级上下文 */
const descriptions = useDescriptions()

/* 派生状态：网格列跨度 */
const gridSpan = computed(() => {
  const column = descriptions?.column ?? 3
  return Math.min(props.span, column)
})
</script>

<template>
  <div
    :class="['wt-descriptions-item', props.customClass]"
    :style="{
      gridColumn: `span ${gridSpan}`
    }"
  >
    <div class="wt-descriptions-item__label">
      <slot name="label">{{ label }}</slot>
    </div>
    <div class="wt-descriptions-item__content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wt-descriptions-item {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 最小宽度 */
  min-width: 0;
  /* 边框 */
  border-bottom: 1px solid color-mix(in srgb, var(--wt-text-secondary) 10%, transparent);
}

.wt-descriptions-item__label {
  /* 宽度 */
  width: 110px;
  /* 内边距 */
  padding: 12px 14px;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 13px;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface-strong) 50%, transparent);
  /* 弹性收缩 */
  flex-shrink: 0;
}

.wt-descriptions-item__content {
  /* 弹性 */
  flex: 1;
  /* 内边距 */
  padding: 12px 14px;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 14px;
}
</style>
