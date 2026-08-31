<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps } from './props'
import { resolveSize } from '../config-provider/context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtButton' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  disabled: false,
  loading: false,
  plain: false,
  round: false,
  block: false,
  nativeType: 'button'
})

/* 声明组件事件 */
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

/* 解析组件尺寸配置 */
const size = resolveSize(() => props.size)

/* 交互处理逻辑 */
const createRipple = (event: MouseEvent) => {
  if (props.disabled || props.loading) return

  const target = event.currentTarget as HTMLElement
  const styles = getComputedStyle(target)
  const enabled = styles.getPropertyValue('--wt-ripple-enabled').trim()
  if (enabled === '0' || enabled === 'false') return

  const rect = target.getBoundingClientRect()
  const ripple = document.createElement('span')
  const color =
    styles.getPropertyValue('--wt-ripple-color').trim() ||
    'rgba(255, 255, 255, 0.38)'
  const opacity = Number(styles.getPropertyValue('--wt-ripple-opacity').trim() || '0.45')
  const scale = Number(styles.getPropertyValue('--wt-ripple-scale').trim() || '9')
  const rawDuration = styles.getPropertyValue('--wt-ripple-duration').trim() || '600ms'
  const duration = rawDuration.endsWith('ms')
    ? Number(rawDuration.slice(0, -2))
    : Number(rawDuration)
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 600

  ripple.style.cssText = `

    position: absolute;
    z-index: 3;
    left: ${event.clientX - rect.left}px;
    top: ${event.clientY - rect.top}px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    pointer-events: none;
    background: ${color};
    opacity: ${opacity};
    transform: translate(-50%, -50%) scale(1);
  `

  target.appendChild(ripple)
  try {
    ripple.animate(
      [
        {
          opacity,
          transform: 'translate(-50%, -50%) scale(1)'
        },
        {
          opacity: 0,
          transform: `translate(-50%, -50%) scale(${scale})`
        }
      ],
      {
        duration: safeDuration,
        easing: 'ease-out'
      }
    )
  } catch {
    ripple.style.transition = `transform ${safeDuration}ms ease-out, opacity ${safeDuration}ms ease-out`
    requestAnimationFrame(() => {
      ripple.style.opacity = '0'
      ripple.style.transform = `translate(-50%, -50%) scale(${scale})`
    })
  }

  window.setTimeout(() => ripple.remove(), safeDuration)
}

/* 交互处理逻辑 */
const handleClick = (event: MouseEvent) => {
  createRipple(event)
  emit('click', event)
}

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-button',
  `wt-button--${props.type}`,
  `wt-button--${size.value}`,
  {
    'is-disabled': props.disabled,
    'is-loading': props.loading,
    'is-plain': props.plain,
    'is-round': props.round,
    'is-block': props.block
  },
  props.customClass
])
</script>

<template>
  <button
    :type="nativeType"
    :class="classes"
    :disabled="disabled || loading"
    :style="customStyle"
    :aria-busy="loading"
    @click="handleClick"
  >
    <span v-if="loading" class="wt-button__loading" aria-hidden="true" />
    <span v-else-if="$slots.icon" class="wt-button__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="wt-button__content">
      <slot />
    </span>
  </button>
</template>
<style scoped lang="scss">
.wt-button {
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 高光尺寸 */
  --wt-highlight-size: min(var(--wt-highlight-size-base), 11px);
  /* 次高光尺寸 */
  --wt-highlight-small-size: min(calc(var(--wt-highlight-size-base) * 0.5), 6px);
  /* 高光内边距 */
  --wt-highlight-inset: min(var(--wt-highlight-offset), 6px);
  /* 溢出裁剪方式 */
  overflow: hidden;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
  /* 元素间距 */
  gap: 8px;
  /* 边框 */
  border: 0;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 字体族 */
  font-family: inherit;
  /* 字重 */
  font-weight: 600;
  /* 字符间距 */
  letter-spacing: 0.02em;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: linear-gradient(
    145deg,
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha)),
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha-strong))
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 8px rgba(0, 0, 0, 0.15),
    inset -2px -2px 5px var(--wt-shadow-light),
    3px 4px 12px rgba(0, 0, 0, 0.1),
    0 1px 4px rgba(0, 0, 0, 0.06);
  /* 文本阴影 */
  text-shadow: var(--wt-text-shadow);
  /* 动画 */
  animation: wt-liquid-flow var(--wt-motion-normal) ease-in-out infinite;
  /* 动画性能提示 */
  will-change: border-radius;
  /* 过渡动画 */
  transition:
    transform 0.2s ease,
    box-shadow 0.25s ease,
    background 0.25s ease,
    border-radius 0.4s ease,
    color 0.2s ease;
  /* 焦点轮廓 */
  outline: none;
  /* 文本选中行为 */
  user-select: none;
  /* 移动端点击高亮颜色 */
  -webkit-tap-highlight-color: transparent;
}

.wt-button::after {
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
  animation: wt-highlight-float var(--wt-motion-normal) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-opacity);
  /* 层叠层级 */
  z-index: 2;
}

.wt-button::before {
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
  /* 层叠层级 */
  z-index: 2;
}

.wt-button:hover:not(:disabled) {
  /* 形变 */
  transform: translateY(-2px) scale(1.02);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 18px 30px 22px 28px / 30px 22px 28px 18px;
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 4px 5px 10px rgba(0, 0, 0, 0.2),
    inset -3px -3px 6px var(--wt-shadow-light),
    4px 6px 16px rgba(0, 0, 0, 0.15),
    0 2px 6px rgba(0, 0, 0, 0.08);
}

.wt-button:active:not(:disabled) {
  /* 形变 */
  transform: translateY(2px) scale(0.92);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 34px 22px 36px 26px / 26px 34px 22px 36px;
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 7px 8px 16px rgba(0, 0, 0, 0.28),
    inset -3px -3px 8px var(--wt-shadow-light),
    2px 3px 8px rgba(0, 0, 0, 0.14);
}

.wt-button:focus-visible {
  /* 焦点轮廓 */
  outline: 2px solid var(--wt-primary);
  /* 焦点轮廓偏移 */
  outline-offset: 3px;
}

.wt-button:disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.58;
}

.wt-button--small {
  /* 最小高度 */
  min-height: 32px;
  /* 内边距 */
  padding: 7px 14px;
  /* 字号 */
  font-size: 13px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
}

.wt-button--medium {
  /* 最小高度 */
  min-height: 40px;
  /* 内边距 */
  padding: 10px 20px;
  /* 字号 */
  font-size: 15px;
}

.wt-button--large {
  /* 最小高度 */
  min-height: 48px;
  /* 内边距 */
  padding: 13px 26px;
  /* 字号 */
  font-size: 17px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-lg);
}

.wt-button--primary {
  /* 文本颜色 */
  color: #fff;
  /* 背景 */
  background: linear-gradient(145deg, color-mix(in srgb, var(--wt-primary) 78%, white), var(--wt-primary));
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(255, 255, 255, 0.25),
    inset -2px -2px 6px rgba(0, 0, 0, 0.18),
    3px 5px 14px color-mix(in srgb, var(--wt-primary) 45%, transparent);
}

.wt-button--success,
.wt-button--warning,
.wt-button--danger,
.wt-button--info {
  /* 文本颜色 */
  color: #fff;
}

.wt-button--success {
  /* 背景 */
  background: linear-gradient(145deg, color-mix(in srgb, var(--wt-success) 78%, white), var(--wt-success));
}

.wt-button--warning {
  /* 背景 */
  background: linear-gradient(145deg, color-mix(in srgb, var(--wt-warning) 78%, white), var(--wt-warning));
}

.wt-button--danger {
  /* 背景 */
  background: linear-gradient(145deg, color-mix(in srgb, var(--wt-danger) 78%, white), var(--wt-danger));
}

.wt-button--info {
  /* 背景 */
  background: linear-gradient(145deg, color-mix(in srgb, var(--wt-info) 78%, white), var(--wt-info));
}

.wt-button.is-round {
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 999px;
}

.wt-button.is-block {
  /* 宽度 */
  width: 100%;
}

.wt-button__loading {
  /* 宽度 */
  width: 14px;
  /* 高度 */
  height: 14px;
  /* 边框 */
  border: 2px solid currentColor;
  /* 右侧边框颜色 */
  border-right-color: transparent;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 50%;
  /* 动画 */
  animation: wt-spin 0.8s linear infinite;
}

@keyframes wt-spin {
  to {
    /* 形变 */
    transform: rotate(360deg);
  }
}
</style>