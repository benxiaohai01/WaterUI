<script setup lang="ts">

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtFooter' })

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
  <footer class="wt-footer" :class="customClass" :style="{ height }">
    <slot />
  </footer>
</template>
<style scoped lang="scss">
.wt-footer {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
  /* 弹性布局中的伸缩比例 */
  flex: 0 0 auto;
  /* 内边距 */
  padding: 0 24px;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
}
</style>