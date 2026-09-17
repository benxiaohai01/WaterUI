<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { DialogProps } from './props'
import { WtIcon } from '../icon'
import { useUid } from '../../utils/uid'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtDialog' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<DialogProps>(), {
  modelValue: false,
  title: '',
  width: '520px',
  closeOnMask: true,
  closable: true,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

/* 响应式状态：面板元素引用（用于焦点管理） */
const panelRef = ref<HTMLElement>()

/* 组件级高光参数（优先级高于全局配置）；面板经 Teleport 渲染，故绑定到面板元素 */
const highlightStyle = useHighlightStyle(props)

/* 派生状态：标题元素 id，供面板 aria-labelledby 关联 */
const titleId = useUid('wt-dialog-title')

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

/* 交互处理逻辑：关闭对话框 */
const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

/* 交互处理逻辑：Esc 关闭、Tab 焦点在面板内首尾循环 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
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
    <Transition name="wt-dialog">
      <div v-if="modelValue" class="wt-dialog" :class="customClass">
        <button class="wt-dialog__mask" type="button" aria-label="关闭对话框" @click="closeOnMask && close()" />
        <section
          ref="panelRef"
          class="wt-dialog__panel"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :style="[highlightStyle, { width }]"
        >
          <header class="wt-dialog__header">
            <h3 :id="titleId">{{ title }}</h3>
            <slot name="title" />
            <button
              v-if="closable"
              class="wt-dialog__close"
              type="button"
              aria-label="关闭"
              @click="close"
            >
              <wt-icon name="close" :size="16" />
            </button>
          </header>
          <div class="wt-dialog__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="wt-dialog__footer">
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-dialog {
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

.wt-dialog__mask {
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

.wt-dialog__panel {
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
  width: min(520px, 92vw);
  /* 最大宽度，约束内联宽度避免超出视口 */
  max-width: 92vw;
  /* 最大高度，避免内容超出视口 */
  max-height: 90vh;
  /* 盒模型显示方式 */
  display: flex;
  /* 弹性布局主轴方向 */
  flex-direction: column;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-lg);
  /* 背景 */
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wt-surface) 94%, white),
    var(--wt-surface)
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 4px 5px 14px rgba(0, 0, 0, 0.08),
    inset -3px -3px 8px var(--wt-shadow-light),
    0 32px 80px rgba(0, 0, 0, 0.24);
  /* 液体形变动画（含 will-change: border-radius, transform） */
  @include wt.wt-liquid-animation(wt-liquid-flow-subtle, var(--wt-motion-slow), (border-radius, transform));
}

.wt-dialog__panel::after,
.wt-dialog__panel::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 是否响应鼠标事件 */
  pointer-events: none;
}

.wt-dialog__panel::after {
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

.wt-dialog__panel::before {
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

.wt-dialog__header {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: space-between;
  /* 元素间距 */
  gap: 12px;
  /* 内边距 */
  padding: 18px 20px 14px;
}

.wt-dialog__header h3 {
  /* 外边距 */
  margin: 0;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 18px;
}

.wt-dialog__close {
  /* 边框 */
  border: 0;
  /* 内边距 */
  padding: 4px;
  /* 背景 */
  background: transparent;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 过渡动画 */
  transition: color var(--wt-motion-fast) ease, transform var(--wt-motion-fast) ease;
}

.wt-dialog__close:hover {
  /* 文本颜色 */
  color: var(--wt-text);
  /* 形变 */
  transform: rotate(90deg);
}

.wt-dialog__body {
  /* 弹性布局中的伸缩比例 */
  flex: 1 1 auto;
  /* 最小高度 */
  min-height: 0;
  /* 溢出裁剪方式 */
  overflow: auto;
  /* 内边距 */
  padding: 4px 20px 20px;
  /* 行高 */
  line-height: 1.65;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
}

.wt-dialog__footer {
  /* 盒模型显示方式 */
  display: flex;
  /* 主轴内容分配方式 */
  justify-content: flex-end;
  /* 元素间距 */
  gap: 10px;
  /* 内边距 */
  padding: 14px 20px 18px;
}

.wt-dialog-enter-active,
.wt-dialog-leave-active {
  /* 过渡动画 */
  transition: opacity var(--wt-motion-base) ease, transform var(--wt-motion-base) ease;
}

.wt-dialog-enter-from,
.wt-dialog-leave-to {
  /* 透明度 */
  opacity: 0;
  /* 形变 */
  transform: scale(0.95) translateY(8px);
}
</style>
