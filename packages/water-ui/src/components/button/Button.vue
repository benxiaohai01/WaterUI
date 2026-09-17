<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps } from './props'
import { resolveSize } from '../config-provider/context'
import { useHighlightStyle } from '../../utils/highlight'

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

/* 组件级高光参数：显式传入时覆盖全局配置（props.ts 为类型专用导入，改动后需重编译本文件） */
const highlightStyle = useHighlightStyle(props)

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
  const rawSize = styles.getPropertyValue('--wt-ripple-size').trim() || '20px'
  const parsedSize = Number.parseFloat(rawSize)
  const size = Number.isFinite(parsedSize) && parsedSize > 0 ? parsedSize : 20
  const rawDuration = styles.getPropertyValue('--wt-ripple-duration').trim() || '600ms'
  const duration = rawDuration.endsWith('ms')
    ? Number(rawDuration.slice(0, -2))
    : Number(rawDuration)
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 600

  /* 键盘触发的 click 事件坐标为 (0,0)，改为从按钮中心扩散 */
  const originX = event.detail === 0 ? rect.width / 2 : event.clientX - rect.left
  const originY = event.detail === 0 ? rect.height / 2 : event.clientY - rect.top

  ripple.style.cssText = `

    position: absolute;
    z-index: 3;
    left: ${originX}px;
    top: ${originY}px;
    width: ${size}px;
    height: ${size}px;
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
    :style="[highlightStyle, customStyle]"
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
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-button {
  /* 水滴高光：定位方式 + 独立层叠上下文 + 主/次高光伪元素（层叠层级 2） */
  @include wt.wt-liquid-highlights(2);
  /* 高光尺寸（随全局基准等比缩放） */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 0.9167);
  /* 次高光尺寸 */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5);
  /* 高光内边距（随全局偏移等比缩放） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 0.75);
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
  /* 水滴表面：背景渐变 + 内外阴影层次 + 文本阴影 */
  @include wt.wt-liquid-surface;
  /* 液体形变动画（含 will-change: border-radius） */
  @include wt.wt-liquid-animation(wt-liquid-flow, var(--wt-motion-normal), border-radius);
  /* 过渡动画 */
  transition:
    transform var(--wt-motion-fast) ease,
    box-shadow var(--wt-motion-fast) ease,
    background var(--wt-motion-fast) ease,
    border-radius var(--wt-motion-base) ease,
    color var(--wt-motion-fast) ease;
  /* 焦点轮廓 */
  outline: none;
  /* 文本选中行为 */
  user-select: none;
  /* 移动端点击高亮颜色 */
  -webkit-tap-highlight-color: transparent;
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

/* 朴素态：降低阴影与高光，突出描边与语义色 */
.wt-button.is-plain {
  /* 背景 */
  background: var(--wt-surface);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, var(--wt-shadow-dark-alpha)),
    inset -2px -2px 5px var(--wt-shadow-light),
    2px 3px 10px rgba(0, 0, 0, 0.08);
}

.wt-button.is-plain::before,
.wt-button.is-plain::after {
  /* 透明度 */
  opacity: 0.35;
}

.wt-button--primary.is-plain {
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-button--success.is-plain {
  /* 文本颜色 */
  color: var(--wt-success);
}

.wt-button--warning.is-plain {
  /* 文本颜色 */
  color: var(--wt-warning);
}

.wt-button--danger.is-plain {
  /* 文本颜色 */
  color: var(--wt-danger);
}

.wt-button--info.is-plain {
  /* 文本颜色 */
  color: var(--wt-info);
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