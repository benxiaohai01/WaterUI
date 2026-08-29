<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'WtCol' })

const props = withDefaults(
  defineProps<{
    span?: number
    offset?: number
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    xxl?: number
    customClass?: string
  }>(),
  {
    span: 24,
    offset: 0,
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24,
    xxl: 24
  }
)

const classes = computed(() => [
  'wt-col',
  `wt-col--${props.span}`,
  `wt-col--offset-${props.offset}`,
  `wt-col-xs--${props.xs}`,
  `wt-col-sm--${props.sm}`,
  `wt-col-md--${props.md}`,
  `wt-col-lg--${props.lg}`,
  `wt-col-xl--${props.xl}`,
  `wt-col-xxl--${props.xxl}`,
  props.customClass
])
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.wt-col {
  flex: 0 0 auto;
  box-sizing: border-box;
  padding-left: 6px;
  padding-right: 6px;
  min-width: 0;
}

@for $i from 0 through 24 {
  .wt-col--#{$i} { width: calc($i / 24 * 100%); }
  .wt-col--offset-#{$i} { margin-left: calc($i / 24 * 100%); }
}

@media (max-width: 575px) {
  @for $i from 0 through 24 {
    .wt-col-xs--#{$i} { width: calc($i / 24 * 100%); }
  }
}

@media (min-width: 576px) {
  @for $i from 0 through 24 {
    .wt-col-sm--#{$i} { width: calc($i / 24 * 100%); }
  }
}

@media (min-width: 768px) {
  @for $i from 0 through 24 {
    .wt-col-md--#{$i} { width: calc($i / 24 * 100%); }
  }
}

@media (min-width: 992px) {
  @for $i from 0 through 24 {
    .wt-col-lg--#{$i} { width: calc($i / 24 * 100%); }
  }
}

@media (min-width: 1200px) {
  @for $i from 0 through 24 {
    .wt-col-xl--#{$i} { width: calc($i / 24 * 100%); }
  }
}

@media (min-width: 1600px) {
  @for $i from 0 through 24 {
    .wt-col-xxl--#{$i} { width: calc($i / 24 * 100%); }
  }
}
</style>
