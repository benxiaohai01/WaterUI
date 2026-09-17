<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import type { SubMenuProps } from './props'
import { useMenu } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtSubMenu' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<SubMenuProps>(), {
  title: '',
  index: '',
  defaultOpened: false,
  disabled: false,
  customClass: ''
})

const menu = useMenu()

/* 响应式状态：是否展开 */
const opened = computed(() => (menu ? menu.isOpen(props.index) : false))

/* 派生状态：类名 */
const classes = computed(() => [
  'wt-sub-menu',
  { 'is-open': opened.value, 'is-disabled': props.disabled },
  props.customClass
])

/* 注册到父级 Menu */
onMounted(() => {
  menu?.register({ index: props.index, title: props.title, disabled: props.disabled })
})

onBeforeUnmount(() => {
  menu?.unregister(props.index)
})

/* 交互处理逻辑：切换展开 */
const toggle = () => {
  if (props.disabled || !menu) return
  menu.toggleOpen(props.index)
}
</script>

<template>
  <li :class="classes" role="menuitem" aria-haspopup="true" :aria-expanded="opened">
    <div
      class="wt-sub-menu__title"
      role="button"
      tabindex="0"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <slot name="title">
        <span class="wt-sub-menu__label">{{ title }}</span>
      </slot>
      <span class="wt-sub-menu__arrow" aria-hidden="true">▾</span>
    </div>

    <ul v-show="opened" class="wt-sub-menu__panel" role="menu">
      <slot />
    </ul>
  </li>
</template>

<style scoped lang="scss">
.wt-sub-menu {
  /* 定位方式 */
  position: relative;
  /* 列表样式 */
  list-style: none;
}

.wt-sub-menu__title {
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
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 过渡动画 */
  transition:
    background var(--wt-motion-fast) ease,
    color var(--wt-motion-fast) ease;
}

.wt-sub-menu__title:hover {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 10%, transparent);
  /* 文本颜色 */
  color: var(--wt-text);
}

.wt-sub-menu__label {
  /* 弹性布局中的伸缩比例 */
  flex: 1;
  /* 最小宽度 */
  min-width: 0;
}

.wt-sub-menu__arrow {
  /* 字号 */
  font-size: 12px;
  /* 过渡动画 */
  transition: transform var(--wt-motion-fast) ease;
}

.wt-sub-menu.is-open > .wt-sub-menu__title .wt-sub-menu__arrow {
  /* 形变 */
  transform: rotate(180deg);
}

.wt-sub-menu__panel {
  /* 外边距 */
  margin: 4px 0 0;
  /* 内边距 */
  padding: 4px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
}

.wt-sub-menu.is-disabled > .wt-sub-menu__title {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.5;
}

/* 深色主题 */
.wt-menu--dark .wt-sub-menu__title {
  /* 文本颜色 */
  color: rgba(255, 255, 255, 0.72);
}

.wt-menu--dark .wt-sub-menu__title:hover {
  /* 背景 */
  background: rgba(255, 255, 255, 0.08);
  /* 文本颜色 */
  color: #fff;
}
</style>
