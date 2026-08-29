<script setup lang="ts">
defineOptions({ name: 'WtHeader' })

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
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  padding: 0 24px;
}
</style>
