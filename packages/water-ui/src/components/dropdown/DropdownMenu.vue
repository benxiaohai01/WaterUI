<script setup lang="ts">
import { computed } from 'vue'
import type { DropdownMenuProps } from './props'
import { useDropdown } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtDropdownMenu' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<DropdownMenuProps>(), {
  customClass: ''
})

const dropdown = useDropdown()

/* 派生状态：菜单类名 */
const classes = computed(() => [
  'wt-dropdown-menu',
  `wt-dropdown-menu--${dropdown?.placement ?? 'bottom'}`,
  { 'is-visible': dropdown?.visible },
  props.customClass
])
</script>

<template>
  <transition name="wt-dropdown">
    <ul v-show="dropdown?.visible" :class="classes" role="menu">
      <slot />
    </ul>
  </transition>
</template>

<style scoped lang="scss">
.wt-dropdown-menu {
  /* 定位方式 */
  position: absolute;
  /* 层叠层级 */
  z-index: 40;
  /* 最小宽度 */
  min-width: 140px;
  /* 外边距 */
  margin: 0;
  /* 内边距 */
  padding: 6px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 96%, transparent);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.07),
    inset -2px -2px 5px var(--wt-shadow-light),
    3px 6px 16px rgba(0, 0, 0, 0.14);
  /* 列表样式 */
  list-style: none;
}

.wt-dropdown-menu--bottom {
  /* 顶部偏移 */
  top: calc(100% + 6px);
  /* 左侧偏移 */
  left: 0;
}

.wt-dropdown-menu--top {
  /* 底部偏移 */
  bottom: calc(100% + 6px);
  /* 左侧偏移 */
  left: 0;
}

.wt-dropdown-menu--left {
  /* 顶部偏移 */
  top: 0;
  /* 右侧偏移 */
  right: calc(100% + 6px);
}

.wt-dropdown-menu--right {
  /* 顶部偏移 */
  top: 0;
  /* 左侧偏移 */
  left: calc(100% + 6px);
}

/* 弹出过渡动画 */
.wt-dropdown-enter-active,
.wt-dropdown-leave-active {
  /* 过渡动画 */
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.wt-dropdown-enter-from,
.wt-dropdown-leave-to {
  /* 透明度 */
  opacity: 0;
  /* 形变 */
  transform: translateY(-4px) scale(0.98);
}
</style>
