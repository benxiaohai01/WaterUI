<script setup lang="ts">
defineOptions({ name: 'WtFooter' })

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
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  padding: 0 24px;
  color: var(--wt-text-secondary);
}
</style>
