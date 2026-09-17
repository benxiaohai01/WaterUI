<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AlertProps } from './props'
import { WtIcon } from '../icon'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtAlert' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<AlertProps>(), {
  type: 'default',
  closable: false,
  showIcon: false,
  /* 显式声明 undefined：Vue 会把「无默认值的布尔 prop」的缺省值转成 false，
     那样受控可见性判定会把缺省当成显式 false，导致未传 visible 时组件不渲染 */
  visible: undefined,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

/* 响应式状态：内部可见性（visible 未受控时兜底） */
const innerVisible = ref(true)

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 派生状态：当前可见性（受控优先，兼作读写入口） */
const visible = computed({
  get: () => props.visible ?? innerVisible.value,
  set: (value: boolean) => {
    innerVisible.value = value
    emit('update:visible', value)
  }
})

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

/* 交互处理逻辑：关闭提示（先隐藏自身，再通知外部） */
const handleClose = () => {
  visible.value = false
  emit('close')
}
</script>

<template>
  <div v-if="visible" :class="classes" :style="[highlightStyle, customStyle]" role="alert">
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
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-alert {
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 高光尺寸（随全局基准等比缩放，默认 12px 与全局一致） */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 1);
  /* 次高光尺寸（默认 6px 与全局一致） */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5);
  /* 高光内边距（随全局偏移等比缩放，默认 8px 与全局一致） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 1);
  /* 主高光顶部定位（等比缩放后在组件内夹取，避免超出边界） */
  --wt-highlight-top: min(calc(var(--wt-highlight-offset) * 1), calc(100% - var(--wt-highlight-size) - 4px));
  /* 主高光右侧定位 */
  --wt-highlight-right: min(calc(var(--wt-highlight-offset) * 1), calc(100% - var(--wt-highlight-size) - 4px));
  /* 次高光顶部定位（主高光位置 + 尺寸 + 间距） */
  --wt-highlight-small-top: min(calc(var(--wt-highlight-offset) * 1 + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 4px));
  /* 次高光右侧定位 */
  --wt-highlight-small-right: min(calc(var(--wt-highlight-offset) * 1 + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 4px));
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
  /* 液体形变动画（含 will-change: border-radius, transform） */
  @include wt.wt-liquid-animation(wt-liquid-flow-subtle, var(--wt-motion-slow), (border-radius, transform));
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
  top: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px));
  /* 右侧偏移 */
  right: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px));
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
  top: min(calc(var(--wt-highlight-inset) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 4px));
  /* 右侧偏移 */
  right: min(calc(var(--wt-highlight-inset) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 4px));
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
  transition: color var(--wt-motion-fast) ease, transform var(--wt-motion-fast) ease;
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
