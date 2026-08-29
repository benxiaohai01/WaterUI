<script setup lang="ts">
import { provide } from 'vue'

defineOptions({ name: 'WtConfigProvider' })

const props = withDefaults(
  defineProps<{
    theme?: 'light' | 'dark' | 'system'
    size?: 'small' | 'medium' | 'large'
    prefix?: string
  }>(),
  {
    theme: 'system',
    size: 'medium',
    prefix: 'wt'
  }
)

provide('wtConfig', props)
</script>

<template>
  <div class="wt-config-provider" :data-wt-size="size" :data-wt-prefix="prefix">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.wt-config-provider {
  display: contents;
}
</style>
