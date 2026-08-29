<script setup lang="ts">
defineOptions({ name: 'WtAside' })

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
  flex: 0 0 auto;
  overflow: auto;
}
</style>
