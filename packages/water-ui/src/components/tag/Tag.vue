<script setup lang="ts">
import { computed } from 'vue'
import type { TagProps } from './props'

defineOptions({ name: 'WtTag' })

const props = withDefaults(defineProps<TagProps>(), {
  type: 'default',
  closable: false,
  round: false,
  disabled: false
})

const emit = defineEmits<{
  close: [event: MouseEvent]
  click: [event: MouseEvent]
}>()

const classes = computed(() => [
  'wt-tag',
  `wt-tag--${props.type}`,
  { 'is-round': props.round, 'is-disabled': props.disabled },
  props.customClass
])
</script>

<template>
  <span
    :class="classes"
    role="status"
    :aria-disabled="disabled"
    @click="(event: MouseEvent) => emit('click', event)"
  >
    <span class="wt-tag__dot" aria-hidden="true" />
    <span class="wt-tag__content">
      <slot />
    </span>
    <button
      v-if="closable"
      class="wt-tag__close"
      type="button"
      aria-label="关闭标签"
      @click.stop="(event: MouseEvent) => emit('close', event)"
    >
      ×
    </button>
  </span>
</template>

<style scoped lang="scss">
.wt-tag {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: var(--wt-radius-sm);
  background: linear-gradient(
    145deg,
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha)),
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha-strong))
  );
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.12),
    inset -1px -1px 3px var(--wt-shadow-light),
    2px 3px 8px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05);
  color: var(--wt-text);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  text-shadow: var(--wt-text-shadow);
  animation: wt-liquid-flow var(--wt-motion-normal) ease-in-out infinite;
  user-select: none;
}

.wt-tag::after {
  content: '';
  position: absolute;
  width: var(--wt-highlight-size);
  height: var(--wt-highlight-size);
  top: max(calc(var(--wt-highlight-safe-margin) - 2px), 3px);
  right: max(calc(var(--wt-highlight-safe-margin) - 2px), 3px);
  background: var(--wt-highlight);
  border-radius: var(--wt-highlight-radius);
  pointer-events: none;
  opacity: 0.45;
}

.wt-tag__dot {
  width: 6px;
  height: 6px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--wt-primary);
}

.wt-tag--default .wt-tag__dot { background: var(--wt-text-secondary); }
.wt-tag--success .wt-tag__dot { background: var(--wt-success); }
.wt-tag--warning .wt-tag__dot { background: var(--wt-warning); }
.wt-tag--danger .wt-tag__dot { background: var(--wt-danger); }
.wt-tag--info .wt-tag__dot { background: var(--wt-info); }

.wt-tag__close {
  border: 0;
  padding: 0 1px;
  background: transparent;
  color: inherit;
  font-size: 17px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.5;
}

.wt-tag__close:hover {
  opacity: 1;
}

.wt-tag.is-round {
  border-radius: 999px;
}

.wt-tag.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
  animation-play-state: paused;
}
</style>
