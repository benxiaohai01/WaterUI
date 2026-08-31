<script setup lang="ts">
import { computed } from 'vue'
import type { DrawerProps } from './props'
import { WtIcon } from '../icon'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtDrawer' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<DrawerProps>(), {
  modelValue: false,
  title: '',
  placement: 'right',
  size: '320px',
  closeOnMask: true,
  closable: true,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

/* 派生状态：面板尺寸样式 */
const panelStyle = computed(() => {
  const vertical = props.placement === 'top' || props.placement === 'bottom'
  return vertical ? { height: props.size } : { width: props.size }
})

/* 交互处理逻辑：关闭抽屉 */
const close = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition :name="`wt-drawer-${placement}`">
      <div v-if="modelValue" class="wt-drawer" :class="[`is-${placement}`, customClass]">
        <button class="wt-drawer__mask" type="button" aria-label="关闭抽屉" @click="closeOnMask && close()" />
        <section class="wt-drawer__panel" :style="panelStyle" role="dialog" aria-modal="true">
          <header class="wt-drawer__header">
            <h3>{{ title }}</h3>
            <slot name="title" />
            <button
              v-if="closable"
              class="wt-drawer__close"
              type="button"
              aria-label="关闭"
              @click="close"
            >
              <wt-icon name="close" :size="16" />
            </button>
          </header>
          <div class="wt-drawer__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="wt-drawer__footer">
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.wt-drawer {
  /* 定位方式 */
  position: fixed;
  /* 层叠层级 */
  z-index: 3400;
  /* 上下左右偏移合成属性 */
  inset: 0;
}

.wt-drawer__mask {
  /* 定位方式 */
  position: absolute;
  /* 上下左右偏移合成属性 */
  inset: 0;
  /* 边框 */
  border: 0;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-bg) 60%, transparent);
  /* 背景滤镜 */
  backdrop-filter: blur(2px);
}

.wt-drawer__panel {
  /* 定位方式 */
  position: absolute;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 盒模型显示方式 */
  display: flex;
  /* 弹性布局主轴方向 */
  flex-direction: column;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wt-surface) 94%, white),
    var(--wt-surface)
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 12px rgba(0, 0, 0, 0.08),
    inset -3px -3px 8px var(--wt-shadow-light),
    0 24px 64px rgba(0, 0, 0, 0.2);
  /* 动画 */
  animation: wt-liquid-flow-subtle var(--wt-motion-slow) ease-in-out infinite;
  /* 动画性能提示 */
  will-change: border-radius, transform;
}

.wt-drawer.is-left .wt-drawer__panel {
  /* 顶部偏移 */
  top: 0;
  /* 底部偏移 */
  bottom: 0;
  /* 左侧偏移 */
  left: 0;
}

.wt-drawer.is-right .wt-drawer__panel {
  /* 顶部偏移 */
  top: 0;
  /* 底部偏移 */
  bottom: 0;
  /* 右侧偏移 */
  right: 0;
}

.wt-drawer.is-top .wt-drawer__panel {
  /* 顶部偏移 */
  top: 0;
  /* 左侧偏移 */
  left: 0;
  /* 右侧偏移 */
  right: 0;
}

.wt-drawer.is-bottom .wt-drawer__panel {
  /* 底部偏移 */
  bottom: 0;
  /* 左侧偏移 */
  left: 0;
  /* 右侧偏移 */
  right: 0;
}

.wt-drawer__panel::after,
.wt-drawer__panel::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 是否响应鼠标事件 */
  pointer-events: none;
}

.wt-drawer__panel::after {
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

.wt-drawer__panel::before {
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

.wt-drawer__header {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: space-between;
  /* 元素间距 */
  gap: 12px;
  /* 内边距 */
  padding: 16px 18px 12px;
}

.wt-drawer__header h3 {
  /* 外边距 */
  margin: 0;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 17px;
}

.wt-drawer__close {
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

.wt-drawer__close:hover {
  /* 文本颜色 */
  color: var(--wt-text);
  /* 形变 */
  transform: rotate(90deg);
}

.wt-drawer__body {
  /* 弹性布局中的伸缩比例 */
  flex: 1 1 auto;
  /* 最小高度 */
  min-height: 0;
  /* 溢出裁剪方式 */
  overflow: auto;
  /* 内边距 */
  padding: 4px 18px 18px;
  /* 行高 */
  line-height: 1.65;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
}

.wt-drawer__footer {
  /* 盒模型显示方式 */
  display: flex;
  /* 主轴内容分配方式 */
  justify-content: flex-end;
  /* 元素间距 */
  gap: 10px;
  /* 内边距 */
  padding: 12px 18px 16px;
}

.wt-drawer-right-enter-active,
.wt-drawer-right-leave-active,
.wt-drawer-left-enter-active,
.wt-drawer-left-leave-active,
.wt-drawer-top-enter-active,
.wt-drawer-top-leave-active,
.wt-drawer-bottom-enter-active,
.wt-drawer-bottom-leave-active {
  /* 过渡动画 */
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.wt-drawer-right-enter-from,
.wt-drawer-right-leave-to {
  /* 形变 */
  transform: translateX(100%);
}

.wt-drawer-left-enter-from,
.wt-drawer-left-leave-to {
  /* 形变 */
  transform: translateX(-100%);
}

.wt-drawer-top-enter-from,
.wt-drawer-top-leave-to {
  /* 形变 */
  transform: translateY(-100%);
}

.wt-drawer-bottom-enter-from,
.wt-drawer-bottom-leave-to {
  /* 形变 */
  transform: translateY(100%);
}
</style>
