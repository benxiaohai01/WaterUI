<script setup lang="ts">
import type { TimelineProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtTimeline' })

/* 声明组件入参与默认值 */
withDefaults(defineProps<TimelineProps>(), {
  customClass: ''
})
</script>

<template>
  <ul :class="['wt-timeline', customClass]">
    <slot />
  </ul>
</template>

<style scoped lang="scss">
.wt-timeline {
  /* 列表样式 */
  list-style: none;
  /* 外边距 */
  margin: 0;
  /* 内边距 */
  padding: 0;
}
</style>
