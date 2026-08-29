<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'WtRow' })

const props = withDefaults(
  defineProps<{
    gutter?: number | [number, number]
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
    align?: 'start' | 'center' | 'end' | 'stretch'
    wrap?: boolean
    customClass?: string
  }>(),
  {
    gutter: 0,
    justify: 'start',
    align: 'stretch',
    wrap: true,
    customClass: ''
  }
)

const style = computed(() => {
  const horizontal = Array.isArray(props.gutter) ? props.gutter[0] : props.gutter
  const vertical = Array.isArray(props.gutter) ? props.gutter[1] : props.gutter
  return {
    marginLeft: horizontal ? `-${horizontal / 2}px` : undefined,
    marginRight: horizontal ? `-${horizontal / 2}px` : undefined,
    rowGap: vertical ? `${vertical}px` : undefined
  }
})
</script>

<template>
  <div
    class="wt-row"
    :class="[`wt-row--${justify}`, `wt-row--align-${align}`, { 'is-wrap': wrap }, customClass]"
    :style="style"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.wt-row {
  display: flex;
  flex-wrap: wrap;
  min-width: 0;
}

.wt-row--start { justify-content: flex-start; }
.wt-row--center { justify-content: center; }
.wt-row--end { justify-content: flex-end; }
.wt-row--between { justify-content: space-between; }
.wt-row--around { justify-content: space-around; }
.wt-row--evenly { justify-content: space-evenly; }
.wt-row--align-start { align-items: flex-start; }
.wt-row--align-center { align-items: center; }
.wt-row--align-end { align-items: flex-end; }
.wt-row--align-stretch { align-items: stretch; }
</style>
