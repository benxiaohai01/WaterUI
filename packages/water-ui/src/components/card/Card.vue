<script setup lang="ts">
import { computed } from 'vue'
import type { CardProps } from './props'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtCard' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<CardProps>(), {
  bordered: true,
  shadow: 'hover',
  customClass: ''
})

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 派生状态：容器类名 */
const classes = computed(() => [
  'wt-card',
  `wt-card--shadow-${props.shadow}`,
  { 'is-bordered': props.bordered },
  props.customClass
])
</script>

<template>
  <div :class="classes" :style="highlightStyle">
    <div v-if="$slots.header || $slots.extra || title" class="wt-card__header">
      <slot name="header">
        <span class="wt-card__title">{{ title }}</span>
      </slot>
      <slot name="extra" />
    </div>
    <div class="wt-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="wt-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wt-card {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: flex;
  /* 主轴方向 */
  flex-direction: column;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 82%, transparent);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 10px rgba(0, 0, 0, 0.06),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 10px 26px rgba(0, 0, 0, 0.05);
  /* 溢出隐藏 */
  overflow: hidden;
  /* 过渡 */
  transition:
    box-shadow var(--wt-motion-normal) ease,
    transform var(--wt-motion-normal) ease;
}

.wt-card.is-bordered {
  /* 边框 */
  border: 1px solid color-mix(in srgb, var(--wt-text-secondary) 12%, transparent);
}

.wt-card--shadow-hover:hover {
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 10px rgba(0, 0, 0, 0.06),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 16px 40px rgba(0, 0, 0, 0.12);
  /* 形变 */
  transform: translateY(-2px);
}

.wt-card--shadow-always {
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 10px rgba(0, 0, 0, 0.06),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 16px 40px rgba(0, 0, 0, 0.12);
}

.wt-card--shadow-never {
  /* 去除阴影 */
  box-shadow: none;
}

.wt-card__header {
  /* 盒模型显示方式 */
  display: flex;
  /* 主轴对齐方式 */
  justify-content: space-between;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 内边距 */
  padding: 16px 20px;
  /* 底部边框 */
  border-bottom: 1px solid color-mix(in srgb, var(--wt-text-secondary) 10%, transparent);
}

.wt-card__title {
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 16px;
  /* 字重 */
  font-weight: 600;
}

.wt-card__body {
  /* 内边距 */
  padding: 20px;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 14px;
  /* 行高 */
  line-height: 1.7;
  /* 弹性 */
  flex: 1;
}

.wt-card__footer {
  /* 内边距 */
  padding: 12px 20px;
  /* 顶部边框 */
  border-top: 1px solid color-mix(in srgb, var(--wt-text-secondary) 10%, transparent);
}
</style>
