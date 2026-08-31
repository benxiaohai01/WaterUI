<script setup lang="ts">
import { computed } from 'vue'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtCol' })

/* 声明组件入参与默认值 */
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

/* 派生状态（计算属性） */
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
  /* 弹性布局中的伸缩比例 */
  flex: 0 0 auto;
  /* 盒模型尺寸计算方式 */
  box-sizing: border-box;
  /* 左侧内边距 */
  padding-left: 6px;
  /* 右侧内边距 */
  padding-right: 6px;
  /* 最小宽度 */
  min-width: 0;
}

@for $i from 0 through 24 {
  .wt-col--#{$i} {
    /* 宽度 */
    width: calc($i / 24 * 100%);
  }

  .wt-col--offset-#{$i} {
    /* 左侧外边距 */
    margin-left: calc($i / 24 * 100%);
  }
}

@media (max-width: 575px) {
  @for $i from 0 through 24 {
    .wt-col-xs--#{$i} {
      /* 宽度 */
      width: calc($i / 24 * 100%);
    }
  }
}

@media (min-width: 576px) {
  @for $i from 0 through 24 {
    .wt-col-sm--#{$i} {
      /* 宽度 */
      width: calc($i / 24 * 100%);
    }
  }
}

@media (min-width: 768px) {
  @for $i from 0 through 24 {
    .wt-col-md--#{$i} {
      /* 宽度 */
      width: calc($i / 24 * 100%);
    }
  }
}

@media (min-width: 992px) {
  @for $i from 0 through 24 {
    .wt-col-lg--#{$i} {
      /* 宽度 */
      width: calc($i / 24 * 100%);
    }
  }
}

@media (min-width: 1200px) {
  @for $i from 0 through 24 {
    .wt-col-xl--#{$i} {
      /* 宽度 */
      width: calc($i / 24 * 100%);
    }
  }
}

@media (min-width: 1600px) {
  @for $i from 0 through 24 {
    .wt-col-xxl--#{$i} {
      /* 宽度 */
      width: calc($i / 24 * 100%);
    }
  }
}
</style>