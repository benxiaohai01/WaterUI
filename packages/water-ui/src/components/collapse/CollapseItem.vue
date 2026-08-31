<script setup lang="ts">
import { computed } from 'vue'
import type { CollapseItemProps } from './props'
import { useCollapse } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtCollapseItem' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<CollapseItemProps>(), {
  title: '',
  disabled: false,
  customClass: ''
})

/* 注入父级上下文 */
const collapse = useCollapse()

/* 派生状态：是否展开 */
const isOpen = computed(() => (collapse ? collapse.isActive(props.name) : false))

/* 交互处理逻辑：点击标题 */
const handleClick = () => {
  if (props.disabled || !collapse) return
  collapse.toggle(props.name)
}
</script>

<template>
  <div
    :class="['wt-collapse-item', { 'is-open': isOpen, 'is-disabled': disabled }, props.customClass]"
  >
    <button
      type="button"
      class="wt-collapse-item__header"
      :disabled="disabled"
      @click="handleClick"
    >
      <span class="wt-collapse-item__title">
        <slot name="title">{{ title }}</slot>
      </span>
      <span class="wt-collapse-item__arrow" aria-hidden="true">▾</span>
    </button>
    <div v-show="isOpen" class="wt-collapse-item__body">
      <div class="wt-collapse-item__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wt-collapse-item {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 78%, transparent);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.05),
    inset -2px -2px 5px var(--wt-shadow-light),
    0 6px 16px rgba(0, 0, 0, 0.04);
  /* 溢出隐藏 */
  overflow: hidden;
}

.wt-collapse-item__header {
  /* 盒模型显示方式 */
  display: flex;
  /* 主轴对齐方式 */
  justify-content: space-between;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 宽度 */
  width: 100%;
  /* 内边距 */
  padding: 14px 18px;
  /* 边框 */
  border: none;
  /* 背景 */
  background: transparent;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 14px;
  /* 字重 */
  font-weight: 500;
  /* 鼠标指针样式 */
  cursor: pointer;
}

.wt-collapse-item__header:hover:not(:disabled) {
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-collapse-item__header:disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.5;
}

.wt-collapse-item__arrow {
  /* 过渡 */
  transition: transform 0.25s ease;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
}

.wt-collapse-item.is-open .wt-collapse-item__arrow {
  /* 形变 */
  transform: rotate(180deg);
}

.wt-collapse-item__body {
  /* 溢出隐藏 */
  overflow: hidden;
  /* 过渡 */
  transition: max-height 0.25s ease;
}

.wt-collapse-item__content {
  /* 内边距 */
  padding: 4px 18px 16px;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 14px;
  /* 行高 */
  line-height: 1.7;
}
</style>
