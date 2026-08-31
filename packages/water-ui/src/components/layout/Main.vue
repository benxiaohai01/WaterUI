<script setup lang="ts">

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtMain' })

/* 声明组件入参与默认值 */
withDefaults(
  defineProps<{
    customClass?: string
  }>(),
  {
    customClass: ''
  }
)
</script>

<template>
  <main class="wt-main" :class="customClass">
    <slot />
  </main>
</template>
<style scoped lang="scss">
.wt-main {
  /* 弹性布局中的伸缩比例 */
  flex: 1;
  /* 最小宽度 */
  min-width: 0;
  /* 最小高度 */
  min-height: 0;
  /* 溢出裁剪方式 */
  overflow: auto;
}
</style>