<script setup lang="ts">
import { computed } from 'vue'
import type { DescriptionsProps } from './props'
import { provideDescriptions } from './context'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtDescriptions' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<DescriptionsProps>(), {
  title: '',
  column: 3,
  bordered: false,
  customClass: ''
})

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 派生状态：网格列数（至少 1 列） */
const columns = computed(() => Math.max(1, Math.floor(props.column)))

/* 提供上下文 */
provideDescriptions({
  get column() {
    return props.column
  },
  get bordered() {
    return props.bordered
  }
})
</script>

<template>
  <div :class="['wt-descriptions', props.customClass]">
    <div v-if="title" class="wt-descriptions__title">{{ title }}</div>
    <div
      class="wt-descriptions__body"
      :class="{ 'is-bordered': bordered }"
      :style="[highlightStyle, { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }]"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wt-descriptions {
  /* 宽度 */
  width: 100%;
}

.wt-descriptions__title {
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 16px;
  /* 字重 */
  font-weight: 600;
  /* 底部外边距 */
  margin-bottom: var(--wt-space-md);
}

.wt-descriptions__body {
  /* 盒模型显示方式 */
  display: grid;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 70%, transparent);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.04),
    inset -2px -2px 5px var(--wt-shadow-light),
    0 6px 16px rgba(0, 0, 0, 0.04);
  /* 溢出隐藏 */
  overflow: hidden;
}

.wt-descriptions__body.is-bordered {
  /* 元素间距 */
  gap: 4px;
  /* 内边距 */
  padding: 4px;
}
</style>
