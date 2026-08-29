<script setup lang="ts">
import { computed } from 'vue'
import type { SwitchProps } from './props'

defineOptions({ name: 'WtSwitch' })

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  disabled: false,
  size: 'medium',
  activeText: '',
  inactiveText: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const isChecked = computed(() => props.modelValue)

const toggle = () => {
  if (props.disabled) return
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <button
    class="wt-switch"
    :class="[`wt-switch--${size}`, { 'is-checked': isChecked, 'is-disabled': disabled }]"
    type="button"
    role="switch"
    :aria-checked="isChecked"
    :aria-disabled="disabled"
    @click="toggle"
  >
    <span class="wt-switch__track">
      <span class="wt-switch__thumb" />
    </span>
    <span v-if="activeText || inactiveText" class="wt-switch__label">
      {{ isChecked ? activeText : inactiveText }}
    </span>
  </button>
</template>

<style scoped lang="scss">
.wt-switch {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
}

.wt-switch__track {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  width: 56px;
  height: 32px;
  border-radius: 22px 18px 24px 20px / 18px 22px 20px 24px;
  background: linear-gradient(
    145deg,
    rgba(0, 0, 0, calc(var(--wt-shadow-dark-alpha) + 0.04)),
    rgba(0, 0, 0, calc(var(--wt-shadow-dark-alpha-strong) + 0.06))
  );
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.12),
    inset -1px -1px 3px var(--wt-shadow-light),
    2px 3px 8px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05);
  transition: background 0.35s ease, box-shadow 0.35s ease;
}

.wt-switch__track::after {
  content: '';
  position: absolute;
  width: var(--wt-highlight-size);
  height: var(--wt-highlight-size);
  top: max(4px, calc(var(--wt-highlight-safe-margin) - 3px));
  right: max(5px, calc(var(--wt-highlight-safe-margin) - 2px));
  background: var(--wt-highlight);
  border-radius: var(--wt-highlight-radius);
  pointer-events: none;
  opacity: 0.45;
}

.wt-switch__thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 26px;
  height: 26px;
  border-radius: 50% 46% 54% 48% / 52% 48% 46% 54%;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.28));
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.2),
    inset -2px -2px 5px rgba(255, 255, 255, 0.25),
    2px 3px 8px rgba(0, 0, 0, 0.2);
  transition: left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.35s ease;
}

.wt-switch.is-checked .wt-switch__track {
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wt-success) 72%, white),
    color-mix(in srgb, var(--wt-success) 88%, black)
  );
}

.wt-switch.is-checked .wt-switch__thumb {
  left: 27px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.42));
}

.wt-switch__label {
  color: var(--wt-text);
  font-size: 14px;
}

.wt-switch--small .wt-switch__track { width: 42px; height: 24px; }
.wt-switch--small .wt-switch__thumb { width: 18px; height: 18px; }
.wt-switch--small.is-checked .wt-switch__thumb { left: 21px; }
.wt-switch--large .wt-switch__track { width: 68px; height: 38px; }
.wt-switch--large .wt-switch__thumb { width: 32px; height: 32px; }
.wt-switch--large.is-checked .wt-switch__thumb { left: 33px; }

.wt-switch:focus-visible {
  outline: 2px solid var(--wt-primary);
  outline-offset: 3px;
}

.wt-switch.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
</style>
