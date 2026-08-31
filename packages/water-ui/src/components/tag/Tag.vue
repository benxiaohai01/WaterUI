<script setup lang="ts">
import { computed } from 'vue'
import type { TagProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtTag' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<TagProps>(), {
  type: 'default',
  closable: false,
  round: false,
  disabled: false
})

/* 声明组件事件 */
const emit = defineEmits<{
  close: [event: MouseEvent]
  click: [event: MouseEvent]
}>()

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-tag',
  `wt-tag--${props.type}`,
  { 'is-round': props.round, 'is-disabled': props.disabled },
  props.customClass
])
</script>

<template>
  <span
    :class="classes"
    role="status"
    :aria-disabled="disabled"
    @click="(event: MouseEvent) => emit('click', event)"
  >
    <span class="wt-tag__dot" aria-hidden="true" />
    <span class="wt-tag__content">
      <slot />
    </span>
    <button
      v-if="closable"
      class="wt-tag__close"
      type="button"
      aria-label="关闭标签"
      @click.stop="(event: MouseEvent) => emit('close', event)"
    >
      ×
    </button>
  </span>
</template>
<style scoped lang="scss">
.wt-tag {
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 高光尺寸 */
  --wt-highlight-size: min(var(--wt-highlight-size-base), 10px);
  /* 次高光尺寸 */
  --wt-highlight-small-size: min(calc(var(--wt-highlight-size-base) * 0.5), 5px);
  /* 高光内边距 */
  --wt-highlight-inset: 4px;
  /* 高光顶部定位 */
  --wt-highlight-top: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 3px));
  /* 高光右侧定位 */
  --wt-highlight-right: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 3px));
  /* 次高光顶部定位 */
  --wt-highlight-small-top: min(calc(var(--wt-highlight-top) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 3px));
  /* 次高光右侧定位 */
  --wt-highlight-small-right: min(calc(var(--wt-highlight-right) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 3px));
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 7px;
  /* 溢出裁剪方式 */
  overflow: hidden;
  /* 内边距 */
  padding: 8px 14px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
  /* 背景 */
  background: linear-gradient(
    145deg,
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha)),
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha-strong))
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.12),
    inset -1px -1px 3px var(--wt-shadow-light),
    2px 3px 8px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05);
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 13px;
  /* 字重 */
  font-weight: 500;
  /* 行高 */
  line-height: 1.2;
  /* 文本阴影 */
  text-shadow: var(--wt-text-shadow);
  /* 动画 */
  animation: wt-liquid-flow var(--wt-motion-normal) ease-in-out infinite;
  /* 文本选中行为 */
  user-select: none;
}

.wt-tag::after {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 宽度 */
  width: var(--wt-highlight-size);
  /* 高度 */
  height: var(--wt-highlight-size);
  /* 顶部偏移 */
  top: var(--wt-highlight-top);
  /* 右侧偏移 */
  right: var(--wt-highlight-right);
  /* 背景 */
  background: var(--wt-highlight);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-radius);
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 动画 */
  animation: wt-highlight-float var(--wt-motion-slow) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-opacity);
}

.wt-tag::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 宽度 */
  width: calc(var(--wt-highlight-small-size) + 1px);
  /* 高度 */
  height: calc(var(--wt-highlight-small-size) + 1px);
  /* 顶部偏移 */
  top: var(--wt-highlight-small-top);
  /* 右侧偏移 */
  right: var(--wt-highlight-small-right);
  /* 背景 */
  background: var(--wt-highlight-small);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-small-radius);
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 动画 */
  animation: wt-highlight-float-small var(--wt-motion-slow) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-small-opacity);
}

.wt-tag__dot {
  /* 宽度 */
  width: 6px;
  /* 高度 */
  height: 6px;
  /* 弹性布局中的伸缩比例 */
  flex: 0 0 auto;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 50%;
  /* 背景 */
  background: var(--wt-primary);
}

.wt-tag--default .wt-tag__dot {
/* 背景 */
background: var(--wt-text-secondary);
}
.wt-tag--success .wt-tag__dot {
/* 背景 */
background: var(--wt-success);
}
.wt-tag--warning .wt-tag__dot {
/* 背景 */
background: var(--wt-warning);
}
.wt-tag--danger .wt-tag__dot {
/* 背景 */
background: var(--wt-danger);
}
.wt-tag--info .wt-tag__dot {
/* 背景 */
background: var(--wt-info);
}

.wt-tag__close {
  /* 边框 */
  border: 0;
  /* 内边距 */
  padding: 0 1px;
  /* 背景 */
  background: transparent;
  /* 文本颜色 */
  color: inherit;
  /* 字号 */
  font-size: 17px;
  /* 行高 */
  line-height: 1;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 透明度 */
  opacity: 0.5;
}

.wt-tag__close:hover {
  /* 透明度 */
  opacity: 1;
}

.wt-tag.is-round {
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 999px;
}

.wt-tag.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.6;
  /* 动画播放状态 */
  animation-play-state: paused;
}
</style>