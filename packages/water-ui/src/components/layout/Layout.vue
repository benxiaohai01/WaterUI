<script setup lang="ts">
defineOptions({ name: 'WtLayout' })

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
  display: flex;
  min-width: 0;
}

.wt-layout--horizontal {
  flex-direction: row;
}

.wt-layout--vertical {
  flex-direction: column;
}
</style>
