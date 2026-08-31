<script setup lang="ts">
import { computed } from 'vue'
import type { ResultProps, ResultStatus } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtResult' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<ResultProps>(), {
  status: 'info',
  title: '',
  subtitle: '',
  customClass: ''
})

/* 状态 → 语义色映射 */
const statusColor: Record<ResultStatus, string> = {
  success: 'var(--wt-success)',
  warning: 'var(--wt-warning)',
  danger: 'var(--wt-danger)',
  info: 'var(--wt-info)',
  '404': 'var(--wt-primary)',
  '500': 'var(--wt-danger)'
}

/* 派生状态：容器类名 */
const classes = computed(() => ['wt-result', `wt-result--${props.status}`, props.customClass])
</script>

<template>
  <div :class="classes">
    <div class="wt-result__icon" :style="{ color: statusColor[status] }">
      <svg v-if="status === 'success'" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 34L28 46L50 20" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <svg v-else-if="status === 'warning'" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 10L56 54H8L32 10Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round" />
        <path d="M32 26V38" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
        <path d="M32 45V47" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      </svg>
      <svg v-else-if="status === 'danger' || status === '500'" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 20L44 44M44 20L20 44" stroke="currentColor" stroke-width="6" stroke-linecap="round" />
      </svg>
      <svg v-else-if="status === '404'" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 24V44M10 34H26M26 24V44" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M38 24V44M38 34H54M54 24V44" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <svg v-else viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 10C24 16 20 24 20 33C20 42 26 54 32 54C38 54 44 42 44 33C44 24 40 16 32 10Z" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M27 30C25 34 25 38 27 42" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.5" />
      </svg>
    </div>
    <h3 v-if="title" class="wt-result__title">{{ title }}</h3>
    <p v-if="subtitle" class="wt-result__subtitle">{{ subtitle }}</p>
    <div v-if="$slots.default" class="wt-result__extra">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wt-result {
  /* 盒模型显示方式 */
  display: flex;
  /* 主轴方向 */
  flex-direction: column;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 文本对齐方式 */
  text-align: center;
  /* 内边距 */
  padding: 48px 24px;
}

.wt-result__icon {
  /* 位置 */
  position: relative;
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴对齐方式 */
  justify-content: center;
  /* 宽度 */
  width: 88px;
  /* 高度 */
  height: 88px;
  /* 背景 */
  background: color-mix(in srgb, currentColor 10%, transparent);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 10px rgba(0, 0, 0, 0.06),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 12px 28px rgba(0, 0, 0, 0.08);
  /* 动画 */
  animation: wt-liquid-flow-subtle var(--wt-motion-slow) ease-in-out infinite;
  /* 动画性能提示 */
  will-change: border-radius;
}

.wt-result__icon svg {
  /* 宽度 */
  width: 52px;
  /* 高度 */
  height: 52px;
}

.wt-result__title {
  /* 外边距 */
  margin: 24px 0 0;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 22px;
  /* 字重 */
  font-weight: 600;
}

.wt-result__subtitle {
  /* 外边距 */
  margin: 10px 0 0;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 14px;
  /* 行高 */
  line-height: 1.7;
  /* 最大宽度 */
  max-width: 420px;
}

.wt-result__extra {
  /* 外边距 */
  margin-top: 28px;
}
</style>
