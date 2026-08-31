<script setup lang="ts">
import { computed } from 'vue'
import type { MessageBoxProps } from './props'
import { WtIcon } from '../icon'
import { WtButton } from '../button'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtMessageBox' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<MessageBoxProps>(), {
  modelValue: false,
  title: '提示',
  message: '',
  type: 'info',
  confirmText: '确定',
  cancelText: '取消',
  showCancel: true,
  maskClosable: true,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

/* 派生状态：图标名称 */
const iconName = computed(() => {
  switch (props.type) {
    case 'success':
      return 'check'
    case 'warning':
      return 'warning'
    case 'error':
      return 'error'
    default:
      return 'question'
  }
})

/* 交互处理逻辑：关闭弹框 */
const close = () => emit('update:modelValue', false)

/* 交互处理逻辑：确认按钮 */
const handleConfirm = () => {
  close()
  emit('confirm')
}

/* 交互处理逻辑：取消按钮 */
const handleCancel = () => {
  close()
  emit('cancel')
}

/* 交互处理逻辑：点击遮罩关闭 */
const handleMask = () => {
  if (props.maskClosable) close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="wt-message-box">
      <div v-if="modelValue" class="wt-message-box" :class="customClass">
        <button class="wt-message-box__mask" type="button" aria-label="关闭弹框" @click="handleMask" />
        <div class="wt-message-box__panel" role="alertdialog" aria-modal="true">
          <span class="wt-message-box__icon" :class="`is-${type}`" aria-hidden="true">
            <wt-icon :name="iconName" :size="22" />
          </span>
          <h3 class="wt-message-box__title">{{ title }}</h3>
          <p class="wt-message-box__message">{{ message }}</p>
          <div class="wt-message-box__actions">
            <wt-button v-if="showCancel" type="default" @click="handleCancel">
              {{ cancelText }}
            </wt-button>
            <wt-button type="primary" @click="handleConfirm">
              {{ confirmText }}
            </wt-button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.wt-message-box {
  /* 定位方式 */
  position: fixed;
  /* 层叠层级 */
  z-index: 3400;
  /* 上下左右偏移合成属性 */
  inset: 0;
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
  /* 内边距 */
  padding: 24px;
}

.wt-message-box__mask {
  /* 定位方式 */
  position: absolute;
  /* 上下左右偏移合成属性 */
  inset: 0;
  /* 边框 */
  border: 0;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-bg) 62%, transparent);
  /* 背景滤镜 */
  backdrop-filter: blur(2px);
}

.wt-message-box__panel {
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 宽度 */
  width: min(420px, 92vw);
  /* 内边距 */
  padding: 26px 24px 22px;
  /* 盒模型尺寸计算方式 */
  box-sizing: border-box;
  /* 文本方向 */
  text-align: center;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-lg);
  /* 背景 */
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wt-surface) 92%, white),
    var(--wt-surface)
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 12px rgba(0, 0, 0, 0.08),
    inset -3px -3px 8px var(--wt-shadow-light),
    0 28px 64px rgba(0, 0, 0, 0.22);
  /* 动画 */
  animation: wt-liquid-flow-subtle var(--wt-motion-slow) ease-in-out infinite;
  /* 动画性能提示 */
  will-change: border-radius, transform;
}

.wt-message-box__panel::after,
.wt-message-box__panel::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 是否响应鼠标事件 */
  pointer-events: none;
}

.wt-message-box__panel::after {
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

.wt-message-box__panel::before {
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

.wt-message-box__icon {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-message-box__icon.is-success {
  /* 文本颜色 */
  color: var(--wt-success);
}

.wt-message-box__icon.is-warning {
  /* 文本颜色 */
  color: var(--wt-warning);
}

.wt-message-box__icon.is-error {
  /* 文本颜色 */
  color: var(--wt-danger);
}

.wt-message-box__title {
  /* 外边距 */
  margin: 14px 0 8px;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 18px;
}

.wt-message-box__message {
  /* 外边距 */
  margin: 0;
  /* 行高 */
  line-height: 1.65;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
}

.wt-message-box__actions {
  /* 盒模型显示方式 */
  display: flex;
  /* 主轴内容分配方式 */
  justify-content: center;
  /* 元素间距 */
  gap: 10px;
  /* 顶部外边距 */
  margin-top: 22px;
}

.wt-message-box-enter-active,
.wt-message-box-leave-active {
  /* 过渡动画 */
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.wt-message-box-enter-from,
.wt-message-box-leave-to {
  /* 透明度 */
  opacity: 0;
  /* 形变 */
  transform: scale(0.94);
}
</style>
