<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, watchEffect } from 'vue'
import { useSelectOptions } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtOption' })

/* 声明组件入参与默认值 */
const props = withDefaults(
  defineProps<{
    label: string
    value: string | number | boolean
    disabled?: boolean
  }>(),
  {
    disabled: false
  }
)

const context = useSelectOptions()

/* 注册信息保持响应式，父级 Select 实时读取最新 label/value/disabled */
const option = reactive({
  label: props.label,
  value: props.value,
  disabled: props.disabled
})

watchEffect(() => {
  option.label = props.label
  option.value = props.value
  option.disabled = props.disabled
})

onMounted(() => context?.register(option))
onBeforeUnmount(() => context?.unregister(option))
</script>

<template>
  <span class="wt-option-slot" aria-hidden="true" />
</template>

<style scoped lang="scss">
.wt-option-slot {
  /* 盒模型显示方式 */
  display: none;
}
</style>