<script setup lang="ts">
import { computed } from 'vue'
import type { DividerProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtDivider' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<DividerProps>(), {
  direction: 'horizontal',
  contentPosition: 'center',
  dashed: false
})

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-divider',
  `wt-divider--${props.direction}`,
  `wt-divider--${props.contentPosition}`,
  { 'is-dashed': props.dashed },
  props.customClass
])
</script>

<template>
  <div :class="classes" role="separator" :aria-orientation="direction === 'vertical' ? 'vertical' : 'horizontal'">
    <span v-if="$slots.default" class="wt-divider__text">
      <slot />
    </span>
  </div>
</template>
<style scoped lang="scss">
.wt-divider {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
}

.wt-divider--horizontal {
  /* 宽度 */
  width: 100%;
  /* 外边距 */
  margin: 18px 0;
}

.wt-divider--vertical {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 高度 */
  height: 1em;
  /* 外边距 */
  margin: 0 12px;
  /* 垂直对齐方式 */
  vertical-align: middle;
}

.wt-divider::before,
.wt-divider::after {
  /* 伪元素内容 */
  content: '';
  /* 弹性布局中的伸缩比例 */
  flex: 1;
  /* 边框 */
  border: 0 solid color-mix(in srgb, var(--wt-text-secondary) 22%, transparent);
}

.wt-divider--horizontal::before,
.wt-divider--horizontal::after {
  /* 顶部边框宽度 */
  border-top-width: 1px;
}

.wt-divider--vertical::before {
  /* 左侧边框宽度 */
  border-left-width: 1px;
  /* 高度 */
  height: 100%;
}

.wt-divider--vertical::after {
  /* 盒模型显示方式 */
  display: none;
}

.wt-divider.is-dashed::before,
.wt-divider.is-dashed::after {
  /* 顶部边框样式 */
  border-top-style: dashed;
}

.wt-divider.is-dashed.wt-divider--vertical::before {
  /* 左侧边框样式 */
  border-left-style: dashed;
}

.wt-divider__text {
  /* 内边距 */
  padding: 0 12px;
  /* 字号 */
  font-size: 14px;
  /* 空白与换行处理 */
  white-space: nowrap;
}

.wt-divider--left::before {
  /* 弹性布局中的伸缩比例 */
  flex: 0 0 36px;
}

.wt-divider--right::after {
  /* 弹性布局中的伸缩比例 */
  flex: 0 0 36px;
}
</style>