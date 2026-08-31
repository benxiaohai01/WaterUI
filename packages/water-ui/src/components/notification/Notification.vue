<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import type { NotificationProps } from './props'
import { WtIcon } from '../icon'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtNotification' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<NotificationProps>(), {
  title: '',
  message: '',
  type: 'info',
  duration: 4500,
  showClose: true,
  offset: 24,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  close: []
}>()

/* 派生状态：通知语义类名 */
const classes = computed(() => [
  'wt-notification',
  `wt-notification--${props.type}`,
  props.customClass
])

/* 派生状态：根据类型映射图标 */
const iconName = computed(() => {
  switch (props.type) {
    case 'success':
      return 'check'
    case 'warning':
      return 'warning'
    case 'error':
      return 'error'
    default:
      return 'notification'
  }
})

let timer: ReturnType<typeof setTimeout> | undefined

/* 交互处理逻辑：按时长自动关闭 */
const startTimer = () => {
  if (props.duration > 0) {
    timer = setTimeout(() => emit('close'), props.duration)
  }
}

/* 生命周期：挂载后启动计时 */
onMounted(startTimer)

/* 生命周期：卸载前清理计时 */
onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <Teleport to="body">
    <aside
      :class="classes"
      role="status"
      :style="{ top: `${offset}px` }"
    >
      <span class="wt-notification__icon" aria-hidden="true">
        <wt-icon :name="iconName" :size="20" />
      </span>
      <div class="wt-notification__body">
        <h4 v-if="title">{{ title }}</h4>
        <p>{{ message }}<slot /></p>
      </div>
      <button
        v-if="showClose"
        class="wt-notification__close"
        type="button"
        aria-label="关闭通知"
        @click="emit('close')"
      >
        <wt-icon name="close" :size="14" />
      </button>
    </aside>
  </Teleport>
</template>

<style scoped lang="scss">
.wt-notification {
  /* 定位方式 */
  position: fixed;
  /* 层叠层级 */
  z-index: 3300;
  /* 右侧偏移 */
  right: 24px;
  /* 宽度 */
  width: min(360px, calc(100vw - 32px));
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: flex-start;
  /* 元素间距 */
  gap: 11px;
  /* 内边距 */
  padding: 15px 16px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 90%, var(--wt-bg));
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 9px rgba(0, 0, 0, 0.08),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 16px 40px rgba(0, 0, 0, 0.14);
  /* 动画 */
  animation: wt-notification-in 0.35s ease both;
  /* 文本颜色 */
  color: var(--wt-text);
}

.wt-notification::after,
.wt-notification::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 是否响应鼠标事件 */
  pointer-events: none;
}

.wt-notification::after {
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
  /* 动画 */
  animation: wt-highlight-float var(--wt-motion-normal) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-opacity);
}

.wt-notification::before {
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

.wt-notification__icon {
  /* 弹性布局中的伸缩比例 */
  flex: 0 0 auto;
  /* 文本颜色 */
  color: var(--wt-info);
}

.wt-notification--success .wt-notification__icon {
  /* 文本颜色 */
  color: var(--wt-success);
}

.wt-notification--warning .wt-notification__icon {
  /* 文本颜色 */
  color: var(--wt-warning);
}

.wt-notification--error .wt-notification__icon {
  /* 文本颜色 */
  color: var(--wt-danger);
}

.wt-notification__body {
  /* 弹性布局中的伸缩比例 */
  flex: 1 1 auto;
  /* 最小宽度 */
  min-width: 0;
}

.wt-notification__body h4 {
  /* 外边距 */
  margin: 0 0 5px;
  /* 字号 */
  font-size: 15px;
}

.wt-notification__body p {
  /* 外边距 */
  margin: 0;
  /* 行高 */
  line-height: 1.55;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
}

.wt-notification__close {
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
}

@keyframes wt-notification-in {
  /* 动画起始状态 */
  0% {
    /* 透明度 */
    opacity: 0;
    /* 形变 */
    transform: translateX(18px) scale(0.97);
  }

  /* 动画结束状态 */
  100% {
    /* 透明度 */
    opacity: 1;
    /* 形变 */
    transform: translateX(0) scale(1);
  }
}
</style>
