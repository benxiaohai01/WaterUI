<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useSelectOptions } from './context'

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
const option = { label: props.label, value: props.value, disabled: props.disabled }

onMounted(() => context?.register(option))
onBeforeUnmount(() => context?.unregister(option))
</script>

<template>
  <template v-if="false"><slot /></template>
</template>