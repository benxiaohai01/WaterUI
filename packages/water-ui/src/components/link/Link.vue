<script setup lang="ts">
import { computed } from 'vue'
import type { LinkProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtLink' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<LinkProps>(), {
  href: '#',
  target: '_self',
  disabled: false,
  underline: true
})

/* 声明组件事件 */
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-link',
  {
    'is-disabled': props.disabled,
    'is-underline': props.underline
  },
  props.customClass
])
</script>

<template>
  <a
    :class="classes"
    :href="disabled ? undefined : href"
    :target="target"
    :aria-disabled="disabled"
    @click="(event: MouseEvent) => emit('click', event)"
  >
    <slot />
  </a>
</template>
<style scoped lang="scss">
.wt-link {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 6px;
  /* 文本颜色 */
  color: var(--wt-primary);
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 文本装饰线 */
  text-decoration: none;
  /* 过渡动画 */
  transition: opacity 0.2s ease, color 0.2s ease;
}

.wt-link.is-underline {
  /* 文本装饰线 */
  text-decoration: underline;
  /* 文本装饰线颜色 */
  text-decoration-color: color-mix(in srgb, var(--wt-primary) 45%, transparent);
  /* 下划线偏移 */
  text-underline-offset: 3px;
}

.wt-link:hover {
  /* 透明度 */
  opacity: 0.82;
}

.wt-link.is-disabled {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.65;
  /* 是否响应鼠标事件 */
  pointer-events: none;
}
</style>