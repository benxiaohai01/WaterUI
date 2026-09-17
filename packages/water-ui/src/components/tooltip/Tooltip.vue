<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TooltipProps } from './props'
import { useUid } from '../../utils/uid'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtTooltip' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<TooltipProps>(), {
  content: '',
  placement: 'top',
  trigger: 'hover',
  disabled: false,
  customClass: ''
})

/* 响应式状态：浮层可见性 */
const visible = ref(false)

/* 组件级高光参数（优先级高于全局配置）；水滴表面在气泡上，故绑定到气泡元素 */
const highlightStyle = useHighlightStyle(props)

/* 派生状态：气泡元素 id，供触发器 aria-describedby 关联 */
const tooltipId = useUid('wt-tooltip')

/* 派生状态：浮层类名 */
const classes = computed(() => [
  'wt-tooltip',
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
    class="wt-tooltip-wrap"
    :aria-describedby="tooltipId"
    @mouseenter="trigger === 'hover' && show()"
    @mouseleave="trigger === 'hover' && hide()"
    @focusin="show"
    @focusout="trigger === 'hover' && hide()"
    @click="trigger === 'click' && toggle()"
  >
    <slot />
    <span :id="tooltipId" :class="classes" :style="highlightStyle" :aria-hidden="!visible" role="tooltip">
      <slot name="content">{{ content }}</slot>
    </span>
  </span>
</template>

<style scoped lang="scss">
.wt-tooltip-wrap {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
}

.wt-tooltip {
  /* 定位方式 */
  position: absolute;
  /* 层叠层级 */
  z-index: 3600;
  /* 宽度 */
  max-width: 260px;
  /* 内边距 */
  padding: 7px 10px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 94%, var(--wt-text));
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 1px 2px 4px rgba(0, 0, 0, 0.08),
    0 8px 20px rgba(0, 0, 0, 0.14);
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 12px;
  /* 行高 */
  line-height: 1.5;
  /* 过渡动画 */
  transition:
    opacity var(--wt-motion-fast) ease,
    transform var(--wt-motion-fast) ease,
    visibility var(--wt-motion-fast);
  /* 透明度 */
  opacity: 0;
  /* 可见性：隐藏态不可聚焦且不进入无障碍树 */
  visibility: hidden;
  /* 是否响应鼠标事件 */
  pointer-events: none;
}

.wt-tooltip.is-visible {
  /* 透明度 */
  opacity: 1;
  /* 可见性 */
  visibility: visible;
  /* 是否响应鼠标事件 */
  pointer-events: auto;
  /* 形变 */
  transform: translateY(0) translateX(0);
}

.wt-tooltip::after {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 宽度 */
  width: 8px;
  /* 高度 */
  height: 8px;
  /* 背景 */
  background: inherit;
  /* 形变 */
  transform: rotate(45deg);
}

.wt-tooltip.is-top {
  /* 底部偏移 */
  bottom: calc(100% + 8px);
  /* 左侧偏移 */
  left: 50%;
  /* 形变 */
  transform: translate(-50%, 4px);
}

.wt-tooltip.is-top.is-visible {
  /* 形变 */
  transform: translate(-50%, 0);
}

.wt-tooltip.is-top::after {
  /* 底部偏移 */
  bottom: -4px;
  /* 左侧偏移 */
  left: calc(50% - 4px);
}

.wt-tooltip.is-bottom {
  /* 顶部偏移 */
  top: calc(100% + 8px);
  /* 左侧偏移 */
  left: 50%;
  /* 形变 */
  transform: translate(-50%, -4px);
}

.wt-tooltip.is-bottom.is-visible {
  /* 形变 */
  transform: translate(-50%, 0);
}

.wt-tooltip.is-bottom::after {
  /* 顶部偏移 */
  top: -4px;
  /* 左侧偏移 */
  left: calc(50% - 4px);
}

.wt-tooltip.is-left {
  /* 右侧偏移 */
  right: calc(100% + 8px);
  /* 顶部偏移 */
  top: 50%;
  /* 形变 */
  transform: translate(4px, -50%);
}

.wt-tooltip.is-left.is-visible {
  /* 形变 */
  transform: translate(0, -50%);
}

.wt-tooltip.is-left::after {
  /* 右侧偏移 */
  right: -4px;
  /* 顶部偏移 */
  top: calc(50% - 4px);
}

.wt-tooltip.is-right {
  /* 左侧偏移 */
  left: calc(100% + 8px);
  /* 顶部偏移 */
  top: 50%;
  /* 形变 */
  transform: translate(-4px, -50%);
}

.wt-tooltip.is-right.is-visible {
  /* 形变 */
  transform: translate(0, -50%);
}

.wt-tooltip.is-right::after {
  /* 左侧偏移 */
  left: -4px;
  /* 顶部偏移 */
  top: calc(50% - 4px);
}
</style>
