<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref } from 'vue'
import type { FormRule } from './props'

export interface FormItemProps {
  label?: string
  prop?: string
  required?: boolean
  error?: string
  rules?: FormRule | FormRule[]
}

defineOptions({ name: 'WtFormItem' })

const props = withDefaults(defineProps<FormItemProps>(), {
  label: '',
  prop: '',
  required: false,
  error: '',
  rules: () => []
})

const form = inject<{
  model: Record<string, unknown>
  rules: Record<string, FormRule | FormRule[]>
  size: 'small' | 'medium' | 'large'
  disabled: boolean
  labelWidth: string
  labelPosition: 'left' | 'top'
  registerField: (field: { prop?: string; validate: () => boolean; clear: () => void }) => void
  unregisterField: (field: { prop?: string; validate: () => boolean; clear: () => void }) => void
}>('wtForm')

const errorMessage = ref('')

const currentRules = computed<FormRule[]>(() => {
  const source = props.prop ? form?.rules[props.prop] : props.rules
  if (!source) return []
  return Array.isArray(source) ? source : [source]
})

const validate = () => {
  const value = props.prop ? form?.model[props.prop] : undefined
  const ruleList = currentRules.value

  for (const rule of ruleList) {
    const isEmpty = value === undefined || value === null || value === ''
    if (rule.required && isEmpty) {
      errorMessage.value = rule.message || '该字段不能为空'
      return false
    }

    if (!isEmpty) {
      if (rule.min !== undefined && String(value).length < rule.min) {
        errorMessage.value = rule.message || `长度不能小于 ${rule.min}`
        return false
      }

      if (rule.max !== undefined && String(value).length > rule.max) {
        errorMessage.value = rule.message || `长度不能大于 ${rule.max}`
        return false
      }

      if (rule.pattern && !rule.pattern.test(String(value))) {
        errorMessage.value = rule.message || '格式不正确'
        return false
      }

      if (rule.validator) {
        const result = rule.validator(value)
        if (result === false) {
          errorMessage.value = rule.message || '校验失败'
          return false
        }
        if (typeof result === 'string') {
          errorMessage.value = result
          return false
        }
      }
    }
  }

  errorMessage.value = ''
  return true
}

const clear = () => {
  errorMessage.value = ''
}

const field = { prop: props.prop, validate, clear }
form?.registerField(field)

onBeforeUnmount(() => {
  form?.unregisterField(field)
})

const classes = computed(() => [
  'wt-form-item',
  `wt-form-item--${form?.labelPosition || 'left'}`,
  {
    'is-required': props.required,
    'is-error': Boolean(props.error || errorMessage.value)
  }
])

const labelStyle = computed(() => ({
  width: form?.labelPosition === 'left' ? form.labelWidth : undefined
}))
</script>

<template>
  <div :class="classes">
    <label v-if="label" class="wt-form-item__label" :style="labelStyle">
      {{ label }}
    </label>
    <div class="wt-form-item__content">
      <slot />
      <p v-if="props.error || errorMessage" class="wt-form-item__error">
        {{ props.error || errorMessage }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wt-form-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}

.wt-form-item--top {
  flex-direction: column;
  gap: 8px;
}

.wt-form-item__label {
  flex: 0 0 auto;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  color: var(--wt-text-secondary);
  font-size: 14px;
  line-height: 1.4;
}

.wt-form-item--top .wt-form-item__label {
  min-height: auto;
}

.wt-form-item.is-required .wt-form-item__label::before {
  content: '*';
  margin-right: 4px;
  color: var(--wt-danger);
}

.wt-form-item__content {
  flex: 1;
  min-width: 0;
}

.wt-form-item__error {
  margin: 6px 0 0;
  color: var(--wt-danger);
  font-size: 12px;
  line-height: 1.4;
}
</style>
