<script setup lang="ts">

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtHeader' })

/* 声明组件入参与默认值 */
withDefaults(
  defineProps<{
    height?: string
    customClass?: string
  }>(),
  {
    height: '64px',
    customClass: ''
  }
)
</script>

<template>
  <header class="wt-header" :class="customClass" :style="{ height }">
    <slot />
  </header>
</template>
<style scoped lang="scss">
.wt-header {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 弹性布局中的伸缩比例 */
  flex: 0 0 auto;
  /* 内边距 */
  padding: 0 24px;
}
</style>