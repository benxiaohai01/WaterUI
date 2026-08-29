<script setup lang="ts">
import { computed } from 'vue'
import type { LinkProps } from './props'

defineOptions({ name: 'WtLink' })

const props = withDefaults(defineProps<LinkProps>(), {
  href: '#',
  target: '_self',
  disabled: false,
  underline: true
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() => [
  'wt-link',
  {
    'is-disabled': props.disabled,
    'is-underline': props.underline
  },
  props.customClass
])
</script>

<template>
  <a
    :class="classes"
    :href="disabled ? undefined : href"
    :target="target"
    :aria-disabled="disabled"
    @click="(event: MouseEvent) => emit('click', event)"
  >
    <slot />
  </a>
</template>

<style scoped lang="scss">
.wt-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--wt-primary);
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s ease, color 0.2s ease;
}

.wt-link.is-underline {
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--wt-primary) 45%, transparent);
  text-underline-offset: 3px;
}

.wt-link:hover {
  opacity: 0.82;
}

.wt-link.is-disabled {
  color: var(--wt-text-placeholder);
  cursor: not-allowed;
  opacity: 0.65;
  pointer-events: none;
}
</style>
