<script setup lang="ts">
import { computed, ref } from 'vue'
import type { InputProps } from './props'

defineOptions({ name: 'WtInput' })

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  size: 'medium',
  clearable: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  input: [value: string | number]
  change: [value: string | number]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement>()

const value = computed(() => props.modelValue)

const classes = computed(() => [
  'wt-input',
  `wt-input--${props.size}`,
  {
    'is-disabled': props.disabled,
    'is-readonly': props.readonly,
    'is-clearable': props.clearable
  },
  props.customClass
])

const handleInput = (event: Event) => {
  const next = (event.target as HTMLInputElement).value
  emit('update:modelValue', next)
  emit('input', next)
}

const handleChange = (event: Event) => {
  emit('change', (event.target as HTMLInputElement).value)
}

const clear = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur()
})
</script>

<template>
  <div :class="classes">
    <span v-if="$slots.prefix" class="wt-input__affix wt-input__prefix" aria-hidden="true">
      <slot name="prefix" />
    </span>
    <input
      ref="inputRef"
      class="wt-input__native"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="handleInput"
      @change="handleChange"
      @focus="(event: FocusEvent) => emit('focus', event)"
      @blur="(event: FocusEvent) => emit('blur', event)"
    >
    <button
      v-if="clearable && String(value).length"
      class="wt-input__clear"
      type="button"
      aria-label="清空"
      @click="clear"
    >
      ×
    </button>
    <span v-if="$slots.suffix" class="wt-input__affix wt-input__suffix" aria-hidden="true">
      <slot name="suffix" />
    </span>
  </div>
</template>

<style scoped lang="scss">
.wt-input {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  border-radius: var(--wt-radius-md);
  background: linear-gradient(
    145deg,
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha)),
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha-strong))
  );
  box-shadow:
    inset 3px 4px 8px rgba(0, 0, 0, 0.15),
    inset -2px -2px 5px var(--wt-shadow-light),
    3px 4px 12px rgba(0, 0, 0, 0.1),
    0 1px 4px rgba(0, 0, 0, 0.06);
  animation: wt-liquid-flow-subtle var(--wt-motion-slow) ease-in-out infinite;
  will-change: transform;
  transition: box-shadow 0.25s ease, background 0.25s ease;
}

.wt-input::after {
  content: '';
  position: absolute;
  width: var(--wt-highlight-size);
  height: var(--wt-highlight-size);
  top: max(calc(var(--wt-highlight-safe-margin) + 2px), 5px);
  right: max(calc(var(--wt-highlight-safe-margin) + 2px), 5px);
  background: var(--wt-highlight);
  border-radius: var(--wt-highlight-radius);
  pointer-events: none;
  animation: wt-highlight-float var(--wt-motion-normal) ease-in-out infinite;
  opacity: 0.5;
  z-index: 3;
}

.wt-input::before {
  content: '';
  position: absolute;
  width: var(--wt-highlight-small-size);
  height: var(--wt-highlight-small-size);
  top: calc(max(calc(var(--wt-highlight-safe-margin) + 2px), 5px) + 10px);
  right: calc(max(calc(var(--wt-highlight-safe-margin) + 2px), 5px) + 12px);
  background: var(--wt-highlight-small);
  border-radius: var(--wt-highlight-small-radius);
  pointer-events: none;
  animation: wt-highlight-float-small var(--wt-motion-slow) ease-in-out infinite;
  opacity: 0.45;
  z-index: 3;
}

.wt-input:focus-within {
  box-shadow:
    inset 4px 5px 10px rgba(0, 0, 0, 0.2),
    inset -3px -3px 6px var(--wt-shadow-light),
    4px 6px 16px rgba(0, 0, 0, 0.15),
    0 0 0 2px color-mix(in srgb, var(--wt-primary) 38%, transparent);
}

.wt-input__native {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--wt-text);
  font-family: inherit;
  font-size: 15px;
  padding: 11px 16px;
  text-shadow: var(--wt-text-shadow);
  caret-color: var(--wt-primary);
}

.wt-input--small .wt-input__native { padding: 7px 12px; font-size: 13px; }
.wt-input--large .wt-input__native { padding: 14px 20px; font-size: 17px; }

.wt-input__native::placeholder {
  color: var(--wt-text-placeholder);
  text-shadow: none;
}

.wt-input__affix {
  display: inline-flex;
  align-items: center;
  color: var(--wt-text-secondary);
}

.wt-input__prefix {
  padding-left: 14px;
}

.wt-input__suffix {
  padding-right: 14px;
}

.wt-input__clear {
  border: 0;
  background: transparent;
  color: var(--wt-text-placeholder);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0 12px 0 0;
}

.wt-input.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.wt-input.is-disabled .wt-input__native {
  cursor: not-allowed;
}
</style>
