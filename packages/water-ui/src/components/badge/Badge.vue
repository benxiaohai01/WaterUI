<script setup lang="ts">
import { computed } from 'vue'
import type { BadgeProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtBadge' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<BadgeProps>(), {
  value: '',
  max: 99,
  dot: false,
  hidden: false,
  type: 'danger'
})

/* 派生状态：展示文本（数字超上限时显示 max+） */
const displayValue = computed(() => {
  if (props.dot) return ''
  if (typeof props.value === 'number' && props.max !== undefined && props.value > props.max) {
    return `${props.max}+`
  }
  return String(props.value)
})

/* 派生状态：容器类名 */
const classes = computed(() => [
  'wt-badge',
  { 'is-dot': props.dot, 'is-hidden': props.hidden },
  props.customClass
])

/* 派生状态：徽标类名 */
const badgeClasses = computed(() => [
  'wt-badge__content',
  `wt-badge--${props.type}`
])
</script>

<template>
  <span :class="classes">
    <slot />
    <sup
      v-if="!hidden && (dot || displayValue !== '')"
      :class="badgeClasses"
      :title="displayValue || undefined"
    >
      {{ displayValue }}
    </sup>
  </span>
</template>

<style scoped lang="scss">
.wt-badge {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 垂直对齐方式 */
  vertical-align: middle;
}

.wt-badge__content {
  /* 定位方式 */
  position: absolute;
  /* 顶部偏移 */
  top: -6px;
  /* 右侧偏移 */
  right: -10px;
  /* 最小宽度 */
  min-width: 20px;
  /* 高度 */
  height: 20px;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 主轴对齐方式 */
  justify-content: center;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 内边距 */
  padding: 0 6px;
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
    inset 1px 2px 4px rgba(0, 0, 0, 0.12),
    inset -1px -1px 3px var(--wt-shadow-light),
    2px 3px 8px rgba(0, 0, 0, 0.1);
  /* 文本颜色 */
  color: #fff;
  /* 字号 */
  font-size: 12px;
  /* 字重 */
  font-weight: 600;
  /* 行高 */
  line-height: 1;
  /* 文本阴影 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  /* 指针事件 */
  pointer-events: none;
  /* 溢出裁剪 */
  overflow: hidden;
  /* 文本选中行为 */
  user-select: none;
}

.wt-badge--default {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface-strong) 90%, var(--wt-text-secondary));
}

.wt-badge--primary {
  /* 背景 */
  background: var(--wt-primary);
}

.wt-badge--success {
  /* 背景 */
  background: var(--wt-success);
}

.wt-badge--warning {
  /* 背景 */
  background: var(--wt-warning);
}

.wt-badge--danger {
  /* 背景 */
  background: var(--wt-danger);
}

.wt-badge--info {
  /* 背景 */
  background: var(--wt-info);
}

.wt-badge.is-dot .wt-badge__content {
  /* 宽度 */
  width: 10px;
  /* 最小宽度 */
  min-width: 10px;
  /* 高度 */
  height: 10px;
  /* 内边距 */
  padding: 0;
  /* 圆角 */
  border-radius: 50%;
}

.wt-badge.is-hidden .wt-badge__content {
  /* 显示方式 */
  display: none;
}
</style>
