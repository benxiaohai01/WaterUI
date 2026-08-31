<script setup lang="ts">

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtLayout' })

/* 声明组件入参与默认值 */
withDefaults(
  defineProps<{
    direction?: 'horizontal' | 'vertical'
    customClass?: string
  }>(),
  {
    direction: 'horizontal',
    customClass: ''
  }
)
</script>

<template>
  <section class="wt-layout" :class="[`wt-layout--${direction}`, customClass]">
    <slot />
  </section>
</template>
<style scoped lang="scss">
.wt-layout {
  /* 盒模型显示方式 */
  display: flex;
  /* 最小宽度 */
  min-width: 0;
}

.wt-layout--horizontal {
  /* 弹性布局主轴方向 */
  flex-direction: row;
}

.wt-layout--vertical {
  /* 弹性布局主轴方向 */
  flex-direction: column;
}
</style>