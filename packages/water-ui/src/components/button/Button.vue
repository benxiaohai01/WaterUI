<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps } from './props'

defineOptions({ name: 'WtButton' })

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  loading: false,
  plain: false,
  round: false,
  block: false,
  nativeType: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

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

const handleClick = (event: MouseEvent) => {
  createRipple(event)
  emit('click', event)
}

const classes = computed(() => [
  'wt-button',
  `wt-button--${props.type}`,
  `wt-button--${props.size}`,
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
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--wt-text);
  border-radius: var(--wt-radius-md);
  background: linear-gradient(
    145deg,
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha)),
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha-strong))
  );
  box-shadow:
    inset 3px 4px 8px rgba(0, 0, 0, 0.15),
    inset -2px -2px 5px var(--wt-shadow-light),
    3px 4px 12px rgba(0, 0, 0, 0.1),
    0 1px 4px rgba(0, 0, 0, 0.06);
  text-shadow: var(--wt-text-shadow);
  animation: wt-liquid-flow var(--wt-motion-normal) ease-in-out infinite;
  will-change: transform;
  transition:
    transform 0.2s ease,
    box-shadow 0.25s ease,
    background 0.25s ease,
    border-radius 0.4s ease,
    color 0.2s ease;
  outline: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.wt-button::after {
  content: '';
  position: absolute;
  width: var(--wt-highlight-size);
  height: var(--wt-highlight-size);
  top: max(var(--wt-highlight-safe-margin), 4px);
  right: max(var(--wt-highlight-safe-margin), 4px);
  background: var(--wt-highlight);
  border-radius: var(--wt-highlight-radius);
  pointer-events: none;
  animation: wt-highlight-float var(--wt-motion-normal) ease-in-out infinite;
  opacity: 0.5;
  z-index: 2;
}

.wt-button::before {
  content: '';
  position: absolute;
  width: var(--wt-highlight-small-size);
  height: var(--wt-highlight-small-size);
  top: calc(max(var(--wt-highlight-safe-margin), 4px) + 10px);
  right: calc(max(var(--wt-highlight-safe-margin), 4px) + 12px);
  background: var(--wt-highlight-small);
  border-radius: var(--wt-highlight-small-radius);
  pointer-events: none;
  animation: wt-highlight-float-small var(--wt-motion-slow) ease-in-out infinite;
  opacity: 0.45;
  z-index: 2;
}

.wt-button:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
  border-radius: 18px 30px 22px 28px / 30px 22px 28px 18px;
  box-shadow:
    inset 4px 5px 10px rgba(0, 0, 0, 0.2),
    inset -3px -3px 6px var(--wt-shadow-light),
    4px 6px 16px rgba(0, 0, 0, 0.15),
    0 2px 6px rgba(0, 0, 0, 0.08);
}

.wt-button:active:not(:disabled) {
  transform: translateY(2px) scale(0.92);
  border-radius: 34px 22px 36px 26px / 26px 34px 22px 36px;
  box-shadow:
    inset 7px 8px 16px rgba(0, 0, 0, 0.28),
    inset -3px -3px 8px var(--wt-shadow-light),
    2px 3px 8px rgba(0, 0, 0, 0.14);
  animation-play-state: paused;
}

.wt-button:focus-visible {
  outline: 2px solid var(--wt-primary);
  outline-offset: 3px;
}

.wt-button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
  animation-play-state: paused;
}

.wt-button--small {
  min-height: 32px;
  padding: 7px 14px;
  font-size: 13px;
  border-radius: var(--wt-radius-sm);
}

.wt-button--medium {
  min-height: 40px;
  padding: 10px 20px;
  font-size: 15px;
}

.wt-button--large {
  min-height: 48px;
  padding: 13px 26px;
  font-size: 17px;
  border-radius: var(--wt-radius-lg);
}

.wt-button--primary {
  color: #fff;
  background: linear-gradient(145deg, color-mix(in srgb, var(--wt-primary) 78%, white), var(--wt-primary));
  box-shadow:
    inset 2px 3px 8px rgba(255, 255, 255, 0.25),
    inset -2px -2px 6px rgba(0, 0, 0, 0.18),
    3px 5px 14px color-mix(in srgb, var(--wt-primary) 45%, transparent);
}

.wt-button--success,
.wt-button--warning,
.wt-button--danger,
.wt-button--info {
  color: #fff;
}

.wt-button--success {
  background: linear-gradient(145deg, color-mix(in srgb, var(--wt-success) 78%, white), var(--wt-success));
}

.wt-button--warning {
  background: linear-gradient(145deg, color-mix(in srgb, var(--wt-warning) 78%, white), var(--wt-warning));
}

.wt-button--danger {
  background: linear-gradient(145deg, color-mix(in srgb, var(--wt-danger) 78%, white), var(--wt-danger));
}

.wt-button--info {
  background: linear-gradient(145deg, color-mix(in srgb, var(--wt-info) 78%, white), var(--wt-info));
}

.wt-button.is-round {
  border-radius: 999px;
}

.wt-button.is-block {
  width: 100%;
}

.wt-button__loading {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: wt-spin 0.8s linear infinite;
}

@keyframes wt-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
