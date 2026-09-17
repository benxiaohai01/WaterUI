<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { PopconfirmProps } from './props'
import { WtIcon } from '../icon'
import { WtButton } from '../button'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtPopconfirm' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<PopconfirmProps>(), {
  title: '',
  content: '确定要执行该操作吗？',
  type: 'warning',
  confirmText: '确定',
  cancelText: '取消',
  placement: 'top',
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
  cancel: []
}>()

/* 响应式状态：气泡确认的内部可见性（visible 未受控时兜底） */
const innerVisible = ref(false)

/* 响应式状态：根节点引用（用于判定点击是否在外部） */
const rootRef = ref<HTMLElement>()

/* 组件级高光参数（优先级高于全局配置）；高光渲染在气泡面板上，故绑定到面板元素 */
const highlightStyle = useHighlightStyle(props)

/* 派生状态：气泡确认的可见性（受控优先，兼作读写入口） */
const visible = computed({
  get: () => props.visible ?? innerVisible.value,
  set: (value: boolean) => {
    innerVisible.value = value
    emit('update:visible', value)
  }
})

/* 派生状态：图标名称 */
const iconName = computed(() => {
  switch (props.type) {
    case 'success':
      return 'check'
    case 'error':
      return 'error'
    default:
      return 'warning'
  }
})

/* 交互处理逻辑：关闭气泡（Esc 与点击外部仅收起，不触发确认/取消） */
const hide = () => {
  visible.value = false
}

/* 交互处理逻辑：确认操作 */
const handleConfirm = () => {
  hide()
  emit('confirm')
}

/* 交互处理逻辑：取消操作 */
const handleCancel = () => {
  hide()
  emit('cancel')
}

/* 交互处理逻辑：Esc 关闭气泡 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') hide()
}

/* 交互处理逻辑：点击外部关闭气泡 */
const handleOutside = (event: PointerEvent) => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) hide()
}

/* 生命周期：仅在展开时注册全局监听，关闭时移除 */
watch(visible, (value) => {
  if (typeof document === 'undefined') return
  if (value) {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('pointerdown', handleOutside)
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('pointerdown', handleOutside)
  }
})

/* 生命周期：卸载时移除全局监听 */
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('pointerdown', handleOutside)
})
</script>

<template>
  <span ref="rootRef" class="wt-popconfirm">
    <span class="wt-popconfirm__trigger" @click="visible = !visible">
      <slot />
    </span>
    <Transition name="wt-popconfirm">
      <section v-if="visible" class="wt-popconfirm__panel" :class="[`is-${placement}`, customClass]" :style="highlightStyle" role="dialog">
        <span class="wt-popconfirm__icon" :class="`is-${type}`" aria-hidden="true">
          <wt-icon :name="iconName" :size="16" />
        </span>
        <div class="wt-popconfirm__text">
          <h4 v-if="title">{{ title }}</h4>
          <p>{{ content }}</p>
        </div>
        <footer class="wt-popconfirm__actions">
          <wt-button size="small" type="default" @click="handleCancel">
            {{ cancelText }}
          </wt-button>
          <wt-button size="small" type="primary" @click="handleConfirm">
            {{ confirmText }}
          </wt-button>
        </footer>
      </section>
    </Transition>
  </span>
</template>

<style scoped lang="scss">
.wt-popconfirm {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: inline-flex;
}

.wt-popconfirm__trigger {
  /* 盒模型显示方式 */
  display: inline-flex;
}

.wt-popconfirm__panel {
  /* 高光尺寸（随全局基准等比缩放） */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 1.0000);
  /* 次高光尺寸 */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5);
  /* 高光内边距（随全局偏移等比缩放） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 1.0000);
  /* 定位方式 */
  position: absolute;
  /* 层叠层级 */
  z-index: 3600;
  /* 宽度 */
  width: 240px;
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: flex-start;
  /* 元素间距 */
  gap: 10px;
  /* 内边距 */
  padding: 13px 14px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 94%, var(--wt-bg));
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.08),
    inset -2px -2px 5px var(--wt-shadow-light),
    0 14px 34px rgba(0, 0, 0, 0.16);
  /* 文本颜色 */
  color: var(--wt-text);
}

.wt-popconfirm__panel::after {
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
  /* 动画 */
  animation: wt-highlight-float-small var(--wt-motion-slow) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-small-opacity);
}

.wt-popconfirm__icon {
  /* 弹性布局中的伸缩比例 */
  flex: 0 0 auto;
  /* 顶部外边距 */
  margin-top: 1px;
  /* 文本颜色 */
  color: var(--wt-warning);
}

.wt-popconfirm__icon.is-success {
  /* 文本颜色 */
  color: var(--wt-success);
}

.wt-popconfirm__icon.is-error {
  /* 文本颜色 */
  color: var(--wt-danger);
}

.wt-popconfirm__text {
  /* 弹性布局中的伸缩比例 */
  flex: 1 1 auto;
}

.wt-popconfirm__text h4 {
  /* 外边距 */
  margin: 0 0 3px;
  /* 字号 */
  font-size: 14px;
}

.wt-popconfirm__text p {
  /* 外边距 */
  margin: 0;
  /* 行高 */
  line-height: 1.55;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 13px;
}

.wt-popconfirm__actions {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 7px;
}

.wt-popconfirm__panel.is-top {
  /* 底部偏移 */
  bottom: calc(100% + 9px);
  /* 左侧偏移 */
  left: 50%;
  /* 形变 */
  transform: translate(-50%, 5px);
}

.wt-popconfirm__panel.is-bottom {
  /* 顶部偏移 */
  top: calc(100% + 9px);
  /* 左侧偏移 */
  left: 50%;
  /* 形变 */
  transform: translate(-50%, -5px);
}

.wt-popconfirm__panel.is-left {
  /* 右侧偏移 */
  right: calc(100% + 9px);
  /* 顶部偏移 */
  top: 50%;
  /* 形变 */
  transform: translate(5px, -50%);
}

.wt-popconfirm__panel.is-right {
  /* 左侧偏移 */
  left: calc(100% + 9px);
  /* 顶部偏移 */
  top: 50%;
  /* 形变 */
  transform: translate(-5px, -50%);
}

.wt-popconfirm-enter-active,
.wt-popconfirm-leave-active {
  /* 过渡动画 */
  transition:
    opacity var(--wt-motion-fast) ease,
    transform var(--wt-motion-fast) ease,
    visibility var(--wt-motion-fast);
}

/* 入场起点与离场终点：按弹出方向给出正确的形变方向与隐藏态 */
.wt-popconfirm__panel.is-top.wt-popconfirm-enter-from,
.wt-popconfirm__panel.is-top.wt-popconfirm-leave-to {
  /* 透明度 */
  opacity: 0;
  /* 可见性：过渡结束态不可聚焦 */
  visibility: hidden;
  /* 形变：位于触发元素上方 */
  transform: translate(-50%, 6px) scale(0.96);
}

.wt-popconfirm__panel.is-bottom.wt-popconfirm-enter-from,
.wt-popconfirm__panel.is-bottom.wt-popconfirm-leave-to {
  /* 透明度 */
  opacity: 0;
  /* 可见性：过渡结束态不可聚焦 */
  visibility: hidden;
  /* 形变：位于触发元素下方 */
  transform: translate(-50%, -6px) scale(0.96);
}

.wt-popconfirm__panel.is-left.wt-popconfirm-enter-from,
.wt-popconfirm__panel.is-left.wt-popconfirm-leave-to {
  /* 透明度 */
  opacity: 0;
  /* 可见性：过渡结束态不可聚焦 */
  visibility: hidden;
  /* 形变：位于触发元素左侧 */
  transform: translate(6px, -50%) scale(0.96);
}

.wt-popconfirm__panel.is-right.wt-popconfirm-enter-from,
.wt-popconfirm__panel.is-right.wt-popconfirm-leave-to {
  /* 透明度 */
  opacity: 0;
  /* 可见性：过渡结束态不可聚焦 */
  visibility: hidden;
  /* 形变：位于触发元素右侧 */
  transform: translate(-6px, -50%) scale(0.96);
}
</style>
