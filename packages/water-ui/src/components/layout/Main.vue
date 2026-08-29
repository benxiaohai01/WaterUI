<script setup lang="ts">
defineOptions({ name: 'WtMain' })

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
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
}
</style>
