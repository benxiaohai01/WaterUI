<script setup lang="ts">
import { computed, provide, reactive } from 'vue'
import type { FormProps } from './props'

defineOptions({ name: 'WtForm' })

const props = withDefaults(defineProps<FormProps>(), {
  model: () => ({}),
  rules: () => ({}),
  labelWidth: '90px',
  labelPosition: 'left',
  size: 'medium',
  disabled: false,
  inline: false
})

const emit = defineEmits<{
  validate: [valid: boolean]
}>()

const fields = reactive<Array<{ prop?: string; validate: () => boolean; clear: () => void }>>([])

const registerField = (field: { prop?: string; validate: () => boolean; clear: () => void }) => {
  fields.push(field)
}

const unregisterField = (field: { prop?: string; validate: () => boolean; clear: () => void }) => {
  const index = fields.indexOf(field)
  if (index !== -1) fields.splice(index, 1)
}

const validate = () => {
  const results = fields.map((field) => field.validate())
  const valid = results.every(Boolean)
  emit('validate', valid)
  return valid
}

const resetFields = () => {
  Object.keys(props.model).forEach((key) => {
    props.model[key] = ''
  })
  fields.forEach((field) => field.clear())
}

const clearValidate = () => {
  fields.forEach((field) => field.clear())
}

provide('wtForm', {
  model: props.model,
  rules: props.rules,
  size: props.size,
  disabled: props.disabled,
  labelWidth: props.labelWidth,
  labelPosition: props.labelPosition,
  registerField,
  unregisterField
})

defineExpose({
  validate,
  resetFields,
  clearValidate
})

const classes = computed(() => [
  'wt-form',
  `wt-form--${props.labelPosition}`,
  {
    'is-inline': props.inline,
    'is-disabled': props.disabled
  }
])
</script>

<template>
  <form :class="classes" novalidate @submit.prevent="validate">
    <slot />
  </form>
</template>

<style scoped lang="scss">
.wt-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
}

.wt-form.is-inline {
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
}

.wt-form.is-disabled {
  opacity: 0.65;
}
</style>
