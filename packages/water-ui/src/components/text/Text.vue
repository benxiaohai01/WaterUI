<script setup lang="ts">
import { computed } from 'vue'
import type { TextProps } from './props'

defineOptions({ name: 'WtText' })

const props = withDefaults(defineProps<TextProps>(), {
  as: 'span',
  size: 'medium',
  type: 'default',
  strong: false,
  italic: false,
  block: false,
  truncate: false
})

const classes = computed(() => [
  'wt-text',
  `wt-text--${props.size}`,
  `wt-text--${props.type}`,
  {
    'is-strong': props.strong,
    'is-italic': props.italic,
    'is-block': props.block,
    'is-truncate': props.truncate
  },
  props.customClass
])
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>

<style scoped lang="scss">
.wt-text {
  color: var(--wt-text);
  line-height: 1.55;
}

.wt-text--small {
  font-size: 13px;
}

.wt-text--medium {
  font-size: 15px;
}

.wt-text--large {
  font-size: 18px;
}

.wt-text--primary { color: var(--wt-primary); }
.wt-text--secondary { color: var(--wt-text-secondary); }
.wt-text--success { color: var(--wt-success); }
.wt-text--warning { color: var(--wt-warning); }
.wt-text--danger { color: var(--wt-danger); }
.wt-text--info { color: var(--wt-info); }
.wt-text.is-strong { font-weight: 700; }
.wt-text.is-italic { font-style: italic; }
.wt-text.is-block { display: block; }
.wt-text.is-truncate { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
</style>
