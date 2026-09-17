<script setup lang="ts">
import { provideConfig } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtConfigProvider' })

/* 声明组件入参与默认值 */
const props = withDefaults(
  defineProps<{
    theme?: 'light' | 'dark' | 'system'
    size?: 'small' | 'medium' | 'large'
  }>(),
  {
    theme: 'system',
    size: 'medium'
  }
)

provideConfig(() => ({
  theme: props.theme,
  size: props.size
}))
</script>

<template>
  <div
    class="wt-config-provider"
    :data-wt-size="size"
    :data-wt-theme="theme === 'system' ? undefined : theme"
  >
    <slot />
  </div>
</template>
<style scoped lang="scss">
.wt-config-provider {
  /* 盒模型显示方式 */
  display: contents;
}
</style>