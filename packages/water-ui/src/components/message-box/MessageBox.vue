<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { MessageBoxProps } from './props'
import { WtIcon } from '../icon'
import { WtButton } from '../button'
import { useUid } from '../../utils/uid'
import { useHighlightStyle } from '../../utils/highlight'

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

/* 组件级高光参数（优先级高于全局配置）；面板经 Teleport 渲染，故绑定到面板元素 */
const highlightStyle = useHighlightStyle(props)

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

/* 交互处理逻辑：点击遮罩关闭（统一走取消语义，消费方可区分确认与取消） */
const handleMask = () => {
  if (props.maskClosable) handleCancel()
}

/* 响应式状态：面板元素引用（用于焦点管理） */
const panelRef = ref<HTMLElement>()

/* 派生状态：标题元素 id，供面板 aria-labelledby 关联 */
const titleId = useUid('wt-message-box-title')

/* 组件实现：body 滚动锁引用计数，多个弹层互不解锁 */
let lockCount = 0
let originalOverflow = ''

/* 交互处理逻辑：锁定页面滚动 */
const lockScroll = () => {
  if (lockCount === 0) {
    originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  lockCount += 1
}

/* 交互处理逻辑：成对恢复页面滚动 */
const unlockScroll = () => {
  if (lockCount === 0) return
  lockCount -= 1
  if (lockCount === 0) document.body.style.overflow = originalOverflow
}

/* 交互处理逻辑：Esc 取消、Tab 焦点在面板内首尾循环 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleCancel()
    return
  }
  if (event.key !== 'Tab') return
  const panel = panelRef.value
  if (!panel) return
  const focusable = panel.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  if (focusable.length === 0) {
    event.preventDefault()
    panel.focus()
    return
  }
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement
  if (event.shiftKey && (active === first || active === panel)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

/* 响应式状态：打开前的焦点元素，关闭后归还 */
let lastActive: HTMLElement | null = null

/* 生命周期：随开关成对处理滚动锁、全局键盘监听与焦点 */
watch(
  () => props.modelValue,
  (value) => {
    if (typeof document === 'undefined') return
    if (value) {
      lockScroll()
      lastActive = document.activeElement as HTMLElement | null
      document.addEventListener('keydown', handleKeydown)
      nextTick(() => panelRef.value?.focus())
    } else {
      document.removeEventListener('keydown', handleKeydown)
      unlockScroll()
      lastActive?.focus()
      lastActive = null
    }
  },
  { immediate: true }
)

/* 生命周期：卸载时移除监听并成对恢复滚动 */
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  unlockScroll()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="wt-message-box">
      <div v-if="modelValue" class="wt-message-box" :class="customClass">
        <button class="wt-message-box__mask" type="button" aria-label="关闭弹框" @click="handleMask" />
        <div
          ref="panelRef"
          class="wt-message-box__panel"
          tabindex="-1"
          role="alertdialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :style="highlightStyle"
        >
          <span class="wt-message-box__icon" :class="`is-${type}`" aria-hidden="true">
            <wt-icon :name="iconName" :size="22" />
          </span>
          <h3 :id="titleId" class="wt-message-box__title">{{ title }}</h3>
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
@use '@water-ui/theme/src/mixins/index.scss' as wt;

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
  /* 高光尺寸（随全局基准等比缩放） */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 1.0000);
  /* 次高光尺寸 */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5);
  /* 高光内边距（随全局偏移等比缩放） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 1.0000);
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
  /* 液体形变动画（含 will-change: border-radius, transform） */
  @include wt.wt-liquid-animation(wt-liquid-flow-subtle, var(--wt-motion-slow), (border-radius, transform));
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

.wt-message-box__panel::before {
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
  transition: opacity var(--wt-motion-base) ease, transform var(--wt-motion-base) ease;
}

.wt-message-box-enter-from,
.wt-message-box-leave-to {
  /* 透明度 */
  opacity: 0;
  /* 形变 */
  transform: scale(0.94);
}
</style>
