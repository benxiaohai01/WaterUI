<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'
import type { FormRule } from './props'
import { useUid } from '../../utils/uid'

export interface FormItemProps {
  label?: string
  prop?: string
  required?: boolean
  error?: string
  rules?: FormRule | FormRule[]
}

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtFormItem' })

/* 声明组件入参与默认值 */
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

/* 响应式状态 */
const errorMessage = ref('')

/* 交互处理逻辑：归一化单条或数组形式的规则 */
const normalizeRules = (source?: FormRule | FormRule[]): FormRule[] => {
  if (!source) return []
  return Array.isArray(source) ? source : [source]
}

/* 合并父级表单规则与自身规则，required 自动合成一条必填规则 */
const currentRules = computed<FormRule[]>(() => {
  const formRules = props.prop ? form?.rules?.[props.prop] : undefined
  const list = [...normalizeRules(formRules), ...normalizeRules(props.rules)]
  if (props.required && !list.some((rule) => rule.required)) {
    list.unshift({ required: true, message: `${props.label || props.prop}不能为空` })
  }
  return list
})

/* 派生状态（计算属性）：是否需要展示必填标记 */
const hasRequired = computed(
  () => props.required || currentRules.value.some((rule) => rule.required)
)

/* 派生状态（计算属性）：当前字段值 */
const fieldValue = computed(() => (props.prop ? form?.model?.[props.prop] : undefined))

/* 校验变化后清除错误提示 */
watch(fieldValue, () => {
  if (errorMessage.value) errorMessage.value = ''
})

/* 交互处理逻辑 */
const validate = () => {
  if (!props.prop && !props.rules && !props.required) {
    errorMessage.value = ''
    return true
  }

  const value = fieldValue.value
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

      if (rule.pattern) {
        const pattern = rule.pattern.global || rule.pattern.sticky
          ? new RegExp(rule.pattern.source, rule.pattern.flags)
          : rule.pattern
        if (!pattern.test(String(value))) {
          errorMessage.value = rule.message || '格式不正确'
          return false
        }
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
        if (typeof (result as unknown as { then?: unknown }).then === 'function') {
          if (import.meta.env.DEV) {
            console.warn('[WtFormItem] validator 返回 Promise 时不会被同步校验等待，请使用同步校验器')
          }
        }
      }
    }
  }

  errorMessage.value = ''
  return true
}

/* 交互处理逻辑 */
const clear = () => {
  errorMessage.value = ''
}

const field = { prop: props.prop, validate, clear }
form?.registerField(field)

onBeforeUnmount(() => {
  form?.unregisterField(field)
})

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-form-item',
  `wt-form-item--${form?.labelPosition || 'left'}`,
  {
    'is-required': hasRequired.value,
    'is-error': Boolean(props.error || errorMessage.value)
  }
])

/* 派生状态（计算属性） */
const labelStyle = computed(() => ({
  width: form?.labelPosition === 'left' ? form.labelWidth : undefined
}))

/* 控件与错误提示的关联 id（通过插槽作用域下发给消费方） */
const fieldId = useUid('wt-form-item')
const errorId = computed(() => `${fieldId}-error`)
</script>

<template>
  <div :class="classes">
    <label v-if="label" class="wt-form-item__label" :style="labelStyle" :for="fieldId">
      {{ label }}
    </label>
    <div class="wt-form-item__content">
      <slot :id="fieldId" :aria-describedby="errorId" />
      <p
        v-if="props.error || errorMessage"
        :id="errorId"
        class="wt-form-item__error"
        role="alert"
      >
        {{ props.error || errorMessage }}
      </p>
    </div>
  </div>
</template>
<style scoped lang="scss">
.wt-form-item {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: flex-start;
  /* 元素间距 */
  gap: 12px;
  /* 最小宽度 */
  min-width: 0;
}

.wt-form-item--top {
  /* 弹性布局主轴方向 */
  flex-direction: column;
  /* 元素间距 */
  gap: 8px;
}

.wt-form-item__label {
  /* 弹性布局中的伸缩比例 */
  flex: 0 0 auto;
  /* 最小高度 */
  min-height: 40px;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 14px;
  /* 行高 */
  line-height: 1.4;
}

.wt-form-item--top .wt-form-item__label {
  /* 最小高度 */
  min-height: auto;
}

.wt-form-item.is-required .wt-form-item__label::before {
  /* 伪元素内容 */
  content: '*';
  /* 右侧外边距 */
  margin-right: 4px;
  /* 文本颜色 */
  color: var(--wt-danger);
}

.wt-form-item__content {
  /* 弹性布局中的伸缩比例 */
  flex: 1;
  /* 最小宽度 */
  min-width: 0;
}

.wt-form-item__error {
  /* 外边距 */
  margin: 6px 0 0;
  /* 文本颜色 */
  color: var(--wt-danger);
  /* 字号 */
  font-size: 12px;
  /* 行高 */
  line-height: 1.4;
}
</style>