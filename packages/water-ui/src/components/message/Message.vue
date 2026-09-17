<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { MessageProps } from './props'
import { WtIcon } from '../icon'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtMessage' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<MessageProps>(), {
  message: '',
  type: 'info',
  duration: 3000,
  showClose: false,
  offset: 24,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  close: []
}>()

/* 响应式状态：内部可见性（声明式使用时点击关闭可自隐藏） */
const visible = ref(true)

/* 组件级高光参数（优先级高于全局配置）；消息经 Teleport 渲染，故绑定到消息元素 */
const highlightStyle = useHighlightStyle(props)

/* 派生状态：消息语义类名 */
const classes = computed(() => [
  'wt-message',
  `wt-message--${props.type}`,
  {
    'is-closable': props.showClose
  },
  props.customClass
])

/* 派生状态：根据消息类型映射图标 */
const iconName = computed(() => {
  switch (props.type) {
    case 'success':
      return 'check'
    case 'warning':
      return 'warning'
    case 'error':
      return 'error'
    default:
      return 'info'
  }
})

let timer: ReturnType<typeof setTimeout> | undefined

/* 交互处理逻辑：关闭消息（先隐藏自身，再交由外部卸载） */
const handleClose = () => {
  visible.value = false
  emit('close')
}

/* 交互处理逻辑：倒计时后自动关闭 */
const startTimer = () => {
  if (props.duration > 0) {
    timer = setTimeout(handleClose, props.duration)
  }
}

/* 生命周期：挂载后启动自动关闭计时 */
onMounted(startTimer)

/* 生命周期：卸载前清除计时器 */
onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :class="classes"
      :style="[highlightStyle, { top: `${offset}px` }]"
      :role="type === 'error' ? 'alert' : 'status'"
    >
      <span class="wt-message__icon" aria-hidden="true">
        <wt-icon :name="iconName" :size="17" />
      </span>
      <span class="wt-message__text">{{ message }}<slot /></span>
      <button
        v-if="showClose || duration === 0"
        class="wt-message__close"
        type="button"
        aria-label="关闭消息"
        @click="handleClose"
      >
        <wt-icon name="close" :size="13" />
      </button>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.wt-message {
  /* 高光尺寸（随全局基准等比缩放） */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 1.0000);
  /* 次高光尺寸 */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5);
  /* 高光内边距（随全局偏移等比缩放） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 1.0000);
  /* 定位方式 */
  position: fixed;
  /* 层叠层级 */
  z-index: 3200;
  /* 顶部偏移（默认值，可被 offset 内联样式覆盖） */
  top: 24px;
  /* 左侧偏移 */
  left: 50%;
  /* 形变 */
  transform: translateX(-50%);
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 9px;
  /* 内边距 */
  padding: 11px 15px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 88%, var(--wt-bg));
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.08),
    inset -2px -2px 5px var(--wt-shadow-light),
    0 14px 34px rgba(0, 0, 0, 0.12);
  /* 动画 */
  animation: wt-message-in var(--wt-motion-base) ease both;
  /* 文本颜色 */
  color: var(--wt-text);
}

.wt-message::after,
.wt-message::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 是否响应鼠标事件 */
  pointer-events: none;
}

.wt-message::after {
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
  /* 动画 */
  animation: wt-highlight-float var(--wt-motion-normal) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-opacity);
}

.wt-message::before {
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
  /* 动画 */
  animation: wt-highlight-float-small var(--wt-motion-slow) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-small-opacity);
}

.wt-message__icon {
  /* 弹性布局中的伸缩比例 */
  flex: 0 0 auto;
  /* 文本颜色 */
  color: var(--wt-info);
}

.wt-message--success .wt-message__icon {
  /* 文本颜色 */
  color: var(--wt-success);
}

.wt-message--warning .wt-message__icon {
  /* 文本颜色 */
  color: var(--wt-warning);
}

.wt-message--error .wt-message__icon {
  /* 文本颜色 */
  color: var(--wt-danger);
}

.wt-message__text {
  /* 字号 */
  font-size: 14px;
  /* 行高 */
  line-height: 1.5;
}

.wt-message__close {
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

.wt-message__close:hover {
  /* 文本颜色 */
  color: var(--wt-text);
  /* 形变 */
  transform: scale(1.12);
}

@keyframes wt-message-in {
  /* 动画起始状态 */
  0% {
    /* 透明度 */
    opacity: 0;
    /* 形变 */
    transform: translate(-50%, -12px) scale(0.96);
  }

  /* 动画结束状态 */
  100% {
    /* 透明度 */
    opacity: 1;
    /* 形变 */
    transform: translate(-50%, 0) scale(1);
  }
}
</style>
