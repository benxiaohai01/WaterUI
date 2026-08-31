<script setup lang="ts">
import { computed } from 'vue'
import type { MenuItemProps } from './props'
import { useMenu } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtMenuItem' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<MenuItemProps>(), {
  index: '',
  disabled: false,
  customClass: ''
})

const menu = useMenu()

/* 派生状态：是否激活 */
const active = computed(() => menu?.activeIndex === props.index)

/* 派生状态：类名 */
const classes = computed(() => [
  'wt-menu-item',
  { 'is-active': active.value, 'is-disabled': props.disabled },
  props.customClass
])

/* 交互处理逻辑：选中 */
const handleClick = () => {
  if (props.disabled || !menu) return
  menu.select(props.index)
}
</script>

<template>
  <li :class="classes" role="menuitem" :aria-current="active ? 'page' : undefined" @click="handleClick">
    <slot />
  </li>
</template>

<style scoped lang="scss">
.wt-menu-item {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 8px;
  /* 内边距 */
  padding: 9px 14px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 14px;
  /* 列表样式 */
  list-style: none;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 过渡动画 */
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.wt-menu-item:hover:not(.is-disabled) {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 10%, transparent);
  /* 文本颜色 */
  color: var(--wt-text);
}

.wt-menu-item.is-active {
  /* 背景 */
  background: linear-gradient(
    145deg,
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha)),
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha-strong))
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.1),
    inset -2px -2px 5px var(--wt-shadow-light),
    2px 3px 8px rgba(0, 0, 0, 0.07);
  /* 文本颜色 */
  color: var(--wt-primary);
  /* 字重 */
  font-weight: 600;
}

.wt-menu-item.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.5;
}

/* 深色主题 */
.wt-menu--dark .wt-menu-item {
  /* 文本颜色 */
  color: rgba(255, 255, 255, 0.72);
}

.wt-menu--dark .wt-menu-item:hover:not(.is-disabled) {
  /* 背景 */
  background: rgba(255, 255, 255, 0.08);
  /* 文本颜色 */
  color: #fff;
}

.wt-menu--dark .wt-menu-item.is-active {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 85%, transparent);
  /* 文本颜色 */
  color: #fff;
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(255, 255, 255, 0.18),
    inset -2px -2px 6px rgba(0, 0, 0, 0.25),
    2px 4px 10px rgba(0, 0, 0, 0.25);
}
</style>
