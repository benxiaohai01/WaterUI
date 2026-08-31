<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PopoverProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtPopover' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<PopoverProps>(), {
  title: '',
  content: '',
  placement: 'top',
  trigger: 'click',
  width: '260px',
  disabled: false,
  customClass: ''
})

/* 响应式状态：浮层可见性 */
const visible = ref(false)

/* 派生状态：浮层类名 */
const classes = computed(() => [
  'wt-popover',
  `is-${props.placement}`,
  { 'is-visible': visible.value },
  props.customClass
])

/* 交互处理逻辑：显示浮层 */
const show = () => {
  if (!props.disabled) visible.value = true
}

/* 交互处理逻辑：隐藏浮层 */
const hide = () => {
  if (props.trigger === 'hover' || !props.disabled) visible.value = false
}

/* 交互处理逻辑：点击切换浮层 */
const toggle = () => {
  if (props.disabled) return
  visible.value = !visible.value
}
</script>

<template>
  <span
    class="wt-popover-wrap"
    @mouseenter="trigger === 'hover' && show()"
    @mouseleave="trigger === 'hover' && hide()"
    @click="trigger === 'click' && toggle()"
  >
    <slot />
    <section :class="classes" :style="{ width }" role="dialog">
      <h4 v-if="title">{{ title }}</h4>
      <div class="wt-popover__content">
        <slot name="content">{{ content }}</slot>
      </div>
      <footer v-if="$slots.actions" class="wt-popover__actions">
        <slot name="actions" />
      </footer>
    </section>
  </span>
</template>

<style scoped lang="scss">
.wt-popover-wrap {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: inline-flex;
}

.wt-popover {
  /* 定位方式 */
  position: absolute;
  /* 层叠层级 */
  z-index: 3600;
  /* 最大宽度 */
  max-width: 320px;
  /* 内边距 */
  padding: 12px 14px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 94%, var(--wt-bg));
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.08),
    inset -2px -2px 5px var(--wt-shadow-light),
    0 14px 34px rgba(0, 0, 0, 0.16);
  /* 文本颜色 */
  color: var(--wt-text);
  /* 过渡动画 */
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  /* 透明度 */
  opacity: 0;
  /* 是否响应鼠标事件 */
  pointer-events: none;
}

.wt-popover.is-visible {
  /* 透明度 */
  opacity: 1;
  /* 是否响应鼠标事件 */
  pointer-events: auto;
}

.wt-popover::after,
.wt-popover::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 是否响应鼠标事件 */
  pointer-events: none;
}

.wt-popover::after {
  /* 宽度 */
  width: var(--wt-highlight-small-size);
  /* 高度 */
  height: var(--wt-highlight-small-size);
  /* 顶部偏移 */
  top: var(--wt-highlight-small-top);
  /* 右侧偏移 */
  right: var(--wt-highlight-small-right);
  /* 背景 */
  background: var(--wt-highlight-small);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-small-radius);
  /* 动画 */
  animation: wt-highlight-float-small var(--wt-motion-slow) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-small-opacity);
}

.wt-popover::before {
  /* 宽度 */
  width: 8px;
  /* 高度 */
  height: 8px;
  /* 背景 */
  background: inherit;
  /* 形变 */
  transform: rotate(45deg);
}

.wt-popover h4 {
  /* 外边距 */
  margin: 0 0 6px;
  /* 字号 */
  font-size: 14px;
}

.wt-popover__content {
  /* 行高 */
  line-height: 1.6;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 13px;
}

.wt-popover__actions {
  /* 盒模型显示方式 */
  display: flex;
  /* 主轴内容分配方式 */
  justify-content: flex-end;
  /* 元素间距 */
  gap: 8px;
  /* 顶部外边距 */
  margin-top: 10px;
}

.wt-popover.is-top {
  /* 底部偏移 */
  bottom: calc(100% + 9px);
  /* 左侧偏移 */
  left: 50%;
  /* 形变 */
  transform: translate(-50%, 5px);
}

.wt-popover.is-top.is-visible {
  /* 形变 */
  transform: translate(-50%, 0);
}

.wt-popover.is-top::before {
  /* 底部偏移 */
  bottom: -4px;
  /* 左侧偏移 */
  left: calc(50% - 4px);
}

.wt-popover.is-bottom {
  /* 顶部偏移 */
  top: calc(100% + 9px);
  /* 左侧偏移 */
  left: 50%;
  /* 形变 */
  transform: translate(-50%, -5px);
}

.wt-popover.is-bottom.is-visible {
  /* 形变 */
  transform: translate(-50%, 0);
}

.wt-popover.is-bottom::before {
  /* 顶部偏移 */
  top: -4px;
  /* 左侧偏移 */
  left: calc(50% - 4px);
}

.wt-popover.is-left {
  /* 右侧偏移 */
  right: calc(100% + 9px);
  /* 顶部偏移 */
  top: 50%;
  /* 形变 */
  transform: translate(5px, -50%);
}

.wt-popover.is-left.is-visible {
  /* 形变 */
  transform: translate(0, -50%);
}

.wt-popover.is-left::before {
  /* 右侧偏移 */
  right: -4px;
  /* 顶部偏移 */
  top: calc(50% - 4px);
}

.wt-popover.is-right {
  /* 左侧偏移 */
  left: calc(100% + 9px);
  /* 顶部偏移 */
  top: 50%;
  /* 形变 */
  transform: translate(-5px, -50%);
}

.wt-popover.is-right.is-visible {
  /* 形变 */
  transform: translate(0, -50%);
}

.wt-popover.is-right::before {
  /* 左侧偏移 */
  left: -4px;
  /* 顶部偏移 */
  top: calc(50% - 4px);
}
</style>
