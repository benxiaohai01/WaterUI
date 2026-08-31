<script setup lang="ts">
import { computed } from 'vue'
import type { DropdownItemProps } from './props'
import { useDropdown } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtDropdownItem' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<DropdownItemProps>(), {
  command: '',
  disabled: false,
  divided: false,
  customClass: ''
})

const dropdown = useDropdown()

/* 派生状态：类名 */
const classes = computed(() => [
  'wt-dropdown-item',
  { 'is-disabled': props.disabled, 'is-divided': props.divided },
  props.customClass
])

/* 交互处理逻辑：点击菜单项 */
const handleClick = () => {
  if (props.disabled || !dropdown) return
  dropdown.onCommand(props.command)
  dropdown.onItemClick()
}
</script>

<template>
  <li
    :class="classes"
    role="menuitem"
    tabindex="0"
    @click="handleClick"
    @keydown.enter.prevent="handleClick"
  >
    <slot />
  </li>
</template>

<style scoped lang="scss">
.wt-dropdown-item {
  /* 内边距 */
  padding: 8px 14px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 14px;
  /* 列表样式 */
  list-style: none;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 过渡动画 */
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.wt-dropdown-item:hover:not(.is-disabled) {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 12%, transparent);
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-dropdown-item.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.5;
}

.wt-dropdown-item.is-divided {
  /* 定位方式 */
  position: relative;
}

.wt-dropdown-item.is-divided::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 顶部偏移 */
  top: 0;
  /* 左侧偏移 */
  left: 8px;
  /* 右侧偏移 */
  right: 8px;
  /* 高度 */
  height: 1px;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-text-placeholder) 25%, transparent);
}
</style>
