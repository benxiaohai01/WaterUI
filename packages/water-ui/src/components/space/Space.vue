<script setup lang="ts">
import { computed } from 'vue'
import type { SpaceProps } from './props'

defineOptions({ name: 'WtSpace' })

const props = withDefaults(defineProps<SpaceProps>(), {
  direction: 'horizontal',
  size: 12,
  wrap: false,
  align: 'center',
  justify: 'start'
})

const classes = computed(() => [
  'wt-space',
  `wt-space--${props.direction}`,
  `wt-space--align-${props.align}`,
  `wt-space--justify-${props.justify}`,
  { 'is-wrap': props.wrap },
  props.customClass
])

const gap = computed(() => typeof props.size === 'number' ? `${props.size}px` : props.size)
</script>

<template>
  <div :class="classes" :style="{ gap }">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.wt-space {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.wt-space--vertical {
  flex-direction: column;
  align-items: flex-start;
}

.wt-space.is-wrap {
  flex-wrap: wrap;
}

.wt-space--align-start { align-items: flex-start; }
.wt-space--align-center { align-items: center; }
.wt-space--align-end { align-items: flex-end; }
.wt-space--align-baseline { align-items: baseline; }
.wt-space--justify-start { justify-content: flex-start; }
.wt-space--justify-center { justify-content: center; }
.wt-space--justify-end { justify-content: flex-end; }
.wt-space--justify-between { justify-content: space-between; }
.wt-space--justify-around { justify-content: space-around; }
.wt-space--justify-evenly { justify-content: space-evenly; }
</style>
