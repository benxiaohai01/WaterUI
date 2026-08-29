<script setup lang="ts">
import { computed } from 'vue'
import type { DividerProps } from './props'

defineOptions({ name: 'WtDivider' })

const props = withDefaults(defineProps<DividerProps>(), {
  direction: 'horizontal',
  contentPosition: 'center',
  dashed: false
})

const classes = computed(() => [
  'wt-divider',
  `wt-divider--${props.direction}`,
  `wt-divider--${props.contentPosition}`,
  { 'is-dashed': props.dashed },
  props.customClass
])
</script>

<template>
  <div :class="classes" role="separator" :aria-orientation="direction === 'vertical' ? 'vertical' : 'horizontal'">
    <span v-if="$slots.default" class="wt-divider__text">
      <slot />
    </span>
  </div>
</template>

<style scoped lang="scss">
.wt-divider {
  display: flex;
  align-items: center;
  color: var(--wt-text-secondary);
}

.wt-divider--horizontal {
  width: 100%;
  margin: 18px 0;
}

.wt-divider--vertical {
  display: inline-flex;
  height: 1em;
  margin: 0 12px;
  vertical-align: middle;
}

.wt-divider::before,
.wt-divider::after {
  content: '';
  flex: 1;
  border: 0 solid color-mix(in srgb, var(--wt-text-secondary) 22%, transparent);
}

.wt-divider--horizontal::before,
.wt-divider--horizontal::after {
  border-top-width: 1px;
}

.wt-divider--vertical::before {
  border-left-width: 1px;
  height: 100%;
}

.wt-divider--vertical::after {
  display: none;
}

.wt-divider.is-dashed::before,
.wt-divider.is-dashed::after {
  border-top-style: dashed;
}

.wt-divider.is-dashed.wt-divider--vertical::before {
  border-left-style: dashed;
}

.wt-divider__text {
  padding: 0 12px;
  font-size: 14px;
  white-space: nowrap;
}

.wt-divider--left::before { flex: 0 0 36px; }
.wt-divider--right::after { flex: 0 0 36px; }
</style>
