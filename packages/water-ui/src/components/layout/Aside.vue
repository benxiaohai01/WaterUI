<script setup lang="ts">

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtAside' })

/* 声明组件入参与默认值 */
withDefaults(
  defineProps<{
    width?: string
    customClass?: string
  }>(),
  {
    width: '264px',
    customClass: ''
  }
)
</script>

<template>
  <aside class="wt-aside" :class="customClass" :style="{ width }">
    <slot />
  </aside>
</template>
<style scoped lang="scss">
.wt-aside {
  /* 弹性布局中的伸缩比例 */
  flex: 0 0 auto;
  /* 溢出裁剪方式 */
  overflow: auto;
}
</style>