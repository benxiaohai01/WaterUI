<script setup lang="ts">
import { computed } from 'vue'
import type { TextProps } from './props'
import { resolveSize } from '../config-provider/context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtText' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<TextProps>(), {
  as: 'span',
  type: 'default',
  strong: false,
  italic: false,
  block: false,
  truncate: false
})

/* 解析组件尺寸配置 */
const size = resolveSize(() => props.size)

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-text',
  `wt-text--${size.value}`,
  `wt-text--${props.type}`,
  {
    'is-strong': props.strong,
    'is-italic': props.italic,
    'is-block': props.block,
    'is-truncate': props.truncate
  },
  props.customClass
])
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
<style scoped lang="scss">
.wt-text {
  /* 文本颜色 */
  color: var(--wt-text);
  /* 行高 */
  line-height: 1.55;
}

.wt-text--small {
  /* 字号 */
  font-size: 13px;
}

.wt-text--medium {
  /* 字号 */
  font-size: 15px;
}

.wt-text--large {
  /* 字号 */
  font-size: 18px;
}

.wt-text--primary {
/* 文本颜色 */
color: var(--wt-primary);
}
.wt-text--secondary {
/* 文本颜色 */
color: var(--wt-text-secondary);
}
.wt-text--success {
/* 文本颜色 */
color: var(--wt-success);
}
.wt-text--warning {
/* 文本颜色 */
color: var(--wt-warning);
}
.wt-text--danger {
/* 文本颜色 */
color: var(--wt-danger);
}
.wt-text--info {
/* 文本颜色 */
color: var(--wt-info);
}
.wt-text.is-strong {
/* 字重 */
font-weight: 700;
}
.wt-text.is-italic {
/* 字体样式 */
font-style: italic;
}
.wt-text.is-block {
/* 盒模型显示方式 */
display: block;
}
.wt-text.is-truncate {
/* 溢出裁剪方式 */
overflow: hidden;
  /* 空白与换行处理 */
  white-space: nowrap;
  /* 文本溢出省略方式 */
  text-overflow: ellipsis;
}
</style>