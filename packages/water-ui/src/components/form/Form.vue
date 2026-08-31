<script setup lang="ts">
import { computed, provide, reactive } from 'vue'
import type { FormProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtForm' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<FormProps>(), {
  modelValue: () => ({}),
  rules: () => ({}),
  labelWidth: '90px',
  labelPosition: 'left',
  size: 'medium',
  disabled: false,
  inline: false
})

/* 声明组件事件 */
const emit = defineEmits<{
  validate: [valid: boolean]
  'update:modelValue': [model: Record<string, unknown>]
}>()

const fields = reactive<Array<{ prop?: string; validate: () => boolean; clear: () => void }>>([])

/* 交互处理逻辑 */
const registerField = (field: { prop?: string; validate: () => boolean; clear: () => void }) => {
  fields.push(field)
}

/* 交互处理逻辑 */
const unregisterField = (field: { prop?: string; validate: () => boolean; clear: () => void }) => {
  const index = fields.indexOf(field)
  if (index !== -1) fields.splice(index, 1)
}

/* 交互处理逻辑 */
const validate = () => {
  const results = fields.map((field) => field.validate())
  const valid = results.every(Boolean)
  emit('validate', valid)
  return valid
}

/* 交互处理逻辑 */
const resetFields = () => {
  const nextModel = { ...props.modelValue }
  Object.keys(nextModel).forEach((key) => {
    nextModel[key] = ''
  })
  emit('update:modelValue', nextModel)
  fields.forEach((field) => field.clear())
}

/* 交互处理逻辑 */
const clearValidate = () => {
  fields.forEach((field) => field.clear())
}

provide('wtForm', {
  model: props.modelValue,
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

/* 派生状态（计算属性） */
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
  /* 盒模型显示方式 */
  display: flex;
  /* 弹性布局主轴方向 */
  flex-direction: column;
  /* 元素间距 */
  gap: 18px;
  /* 宽度 */
  width: 100%;
}

.wt-form.is-inline {
  /* 弹性布局主轴方向 */
  flex-direction: row;
  /* 交叉轴对齐方式 */
  align-items: flex-start;
  /* 弹性项是否换行 */
  flex-wrap: wrap;
}

.wt-form.is-disabled {
  /* 透明度 */
  opacity: 0.65;
}
</style>