<script setup lang="ts">
import type { DialogProps } from './props'
import { WtIcon } from '../icon'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtDialog' })

/* 声明组件入参与默认值 */
withDefaults(defineProps<DialogProps>(), {
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

/* 交互处理逻辑：关闭对话框 */
const close = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="wt-dialog">
      <div v-if="modelValue" class="wt-dialog" :class="customClass">
        <button class="wt-dialog__mask" type="button" aria-label="关闭对话框" @click="closeOnMask && close()" />
        <section class="wt-dialog__panel" role="dialog" aria-modal="true" :style="{ width }">
          <header class="wt-dialog__header">
            <h3>{{ title }}</h3>
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
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 宽度 */
  width: min(520px, 92vw);
  /* 最大高度 */
  max-height: calc(100vh - 80px);
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
  /* 动画 */
  animation: wt-liquid-flow-subtle var(--wt-motion-slow) ease-in-out infinite;
  /* 动画性能提示 */
  will-change: border-radius, transform;
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

.wt-dialog__panel::before {
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
  transition: color 0.2s ease, transform 0.2s ease;
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
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.wt-dialog-enter-from,
.wt-dialog-leave-to {
  /* 透明度 */
  opacity: 0;
  /* 形变 */
  transform: scale(0.95) translateY(8px);
}
</style>
