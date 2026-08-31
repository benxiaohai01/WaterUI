<script setup lang="ts">
import { computed } from 'vue'
import type { AlertProps } from './props'
import { WtIcon } from '../icon'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtAlert' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<AlertProps>(), {
  type: 'default',
  closable: false,
  showIcon: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  close: []
}>()

/* 派生状态：Alert 状态类名 */
const classes = computed(() => [
  'wt-alert',
  `wt-alert--${props.type}`,
  props.customClass
])

/* 派生状态：根据语义类型映射水滴图标 */
const iconName = computed(() => {
  switch (props.type) {
    case 'success':
      return 'check'
    case 'warning':
      return 'warning'
    case 'danger':
      return 'error'
    default:
      return 'info'
  }
})

/* 交互处理逻辑：关闭提示 */
const handleClose = () => emit('close')
</script>

<template>
  <div :class="classes" role="alert">
    <span v-if="showIcon" class="wt-alert__icon" aria-hidden="true">
      <wt-icon :name="iconName" :size="18" />
    </span>
    <div class="wt-alert__content">
      <h4 v-if="title">{{ title }}</h4>
      <p v-if="description">{{ description }}</p>
      <slot />
    </div>
    <button v-if="closable" class="wt-alert__close" type="button" aria-label="关闭提示" @click="handleClose">
      <wt-icon name="close" :size="14" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.wt-alert {
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: flex-start;
  /* 元素间距 */
  gap: 12px;
  /* 内边距 */
  padding: 14px 16px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 82%, transparent);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 10px rgba(0, 0, 0, 0.08),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 10px 24px rgba(0, 0, 0, 0.06);
  /* 动画 */
  animation: wt-liquid-flow-subtle var(--wt-motion-slow) ease-in-out infinite;
  /* 动画性能提示 */
  will-change: border-radius, transform;
  /* 文本颜色 */
  color: var(--wt-text);
}

.wt-alert::after {
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

.wt-alert::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
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
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 动画 */
  animation: wt-highlight-float-small var(--wt-motion-slow) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-small-opacity);
}

.wt-alert__icon {
  /* 弹性布局中的伸缩比例 */
  flex: 0 0 auto;
  /* 顶部外边距 */
  margin-top: 1px;
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-alert__content {
  /* 弹性布局中的伸缩比例 */
  flex: 1 1 auto;
  /* 最小宽度 */
  min-width: 0;
}

.wt-alert__content h4 {
  /* 外边距 */
  margin: 0 0 4px;
  /* 字号 */
  font-size: 15px;
  /* 字重 */
  font-weight: 650;
}

.wt-alert__content p {
  /* 外边距 */
  margin: 0;
  /* 行高 */
  line-height: 1.6;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
}

.wt-alert__close {
  /* 边框 */
  border: 0;
  /* 内边距 */
  padding: 2px;
  /* 背景 */
  background: transparent;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 过渡动画 */
  transition: color 0.2s ease, transform 0.2s ease;
}

.wt-alert__close:hover {
  /* 文本颜色 */
  color: var(--wt-text);
  /* 形变 */
  transform: scale(1.1);
}

.wt-alert--primary .wt-alert__icon {
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-alert--success .wt-alert__icon {
  /* 文本颜色 */
  color: var(--wt-success);
}

.wt-alert--warning .wt-alert__icon {
  /* 文本颜色 */
  color: var(--wt-warning);
}

.wt-alert--danger .wt-alert__icon {
  /* 文本颜色 */
  color: var(--wt-danger);
}

.wt-alert--info .wt-alert__icon {
  /* 文本颜色 */
  color: var(--wt-info);
}
</style>
